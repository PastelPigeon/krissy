const text = [
  "kris， 我们在哪里？",
  "I'm with you in the dark",
  "【【大仁物】】 !",
  "it's tv time!",
  "ヾ(•ω•`)o"
]

function useRandomText(){
  return text[Math.floor(Math.random() * text.length)]
}

export { useRandomText }