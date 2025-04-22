import { ACTIONS } from "./actions"

export default function Buttons({ dispatch, operation }) {
    return (
        <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>{operation}</button>
    )
}