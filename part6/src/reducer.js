const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const { good } = state
      return { ...state, good: good + 1 }
    case 'OK':
      const { ok } = state
      return { ...state, ok: ok + 1 }
    case 'BAD':
      const { bad } = state
      return { ...state, bad: bad + 1 }
    case 'ZERO':
      return { ...initialState }
    default: return state
  }

}

export default counterReducer
