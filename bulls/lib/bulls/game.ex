defmodule Bulls.Game do
  # This module doesn't do stuff,
  # it computes stuff.

  def new do
    %{
      secret: random_secret(),
      guesses: MapSet.new(),
    }
  end

  def guess(st, codeGuess) do
    %{ st | guesses: MapSet.put(st.guesses, cowsAndBulls(st,codeGuess)) }
  end

  def getBulls(secret, codeGuess, bulls) do
    if String.length(secret) == 0 do
      Integer.to_string(bulls)
    else
      length = String.length(secret)
      if String.slice(secret,0,1) == String.slice(codeGuess,0,1) do
        getBulls(String.slice(secret,1,length), String.slice(codeGuess,1,length), bulls + 1)
      else
        getBulls(String.slice(secret,1,length), String.slice(codeGuess,1,length), bulls)
      end
    end
  end

  def getCows(wholeSecret, secret, codeGuess, cows) do
    if String.length(secret) == 0 do
      Integer.to_string(cows)
    else
      length = String.length(secret)
      if String.slice(secret,0,1) != String.slice(codeGuess,0,1) and Enum.member?(String.graphemes(wholeSecret),String.slice(codeGuess,0,1)) do
        getCows(wholeSecret, String.slice(secret,1,length), String.slice(codeGuess,1,length), cows + 1)
      else
        getCows(wholeSecret, String.slice(secret,1,length), String.slice(codeGuess,1,length), cows)
      end
    end
  end

  # Returns a string representing the number of bulls and cows from the current guess
  def cowsAndBulls(st, codeGuess) do
    codeGuess <> " " <> getBulls(st.secret, codeGuess, 0) <> "B" <> getCows(st.secret, st.secret, codeGuess, 0) <> "C"
  end

  def view(st) do
    code = st.secret
           |> String.graphemes
           |> Enum.map(fn xx ->
      if MapSet.member?(st.guesses, xx) do
        "_"
      else
        "_"
      end
    end)
           |> Enum.join("")

    %{
      code: code,
      guesses: MapSet.to_list(st.guesses),
    }
  end

  def build_secret(secret) do
    if String.length(secret) == 4 do
      secret
    else
      new_val = Integer.to_string(Enum.random(0..9))
      if secret =~ new_val do
        build_secret(secret)
      else
        build_secret(secret <> new_val)
      end
    end
  end

  def random_secret() do
    build_secret("")
  end
end
