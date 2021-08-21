export const CollapsedReducer = (prevState = { isCollapsed: true }, action) => {
    let { type } = action

    switch (type) {
        case 'changeCollapsed':
            let newState = { ...prevState }
            newState.isCollapsed = !newState.isCollapsed
            return newState
        default:
    }

    return prevState
}
