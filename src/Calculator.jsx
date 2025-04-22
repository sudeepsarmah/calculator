import React, { useReducer } from "react";
import Buttons from "./Buttons";
import OperationButtons from "./OperationButtons"
import { ACTIONS } from "./actions";


function reducer(state, { type, payload }) {
    switch (type) {
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,
                    overwrite: false
                }
            }
            // to prevent more than one '0' to be added in the first place
            if (payload.digit === "0" && state.currentOperand === "0") return state
            // to avoid more than one '.' in a number
            if (payload.digit === "." && state.currentOperand.include(".")) return state
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`
            }

        case ACTIONS.CHOOSE_OPERATION:
            if (state.currentOperand == null && state.previousOperand == null) {
                return state
            }

            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation
                }
            }


            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                    previousOperand: state.currentOperand,
                    currentOperand: null
                }
            }
            return {
                ...state,
                operation: payload.operation,
                previousOperand: evaluate(state),
                currentOperand: null
            }

        case ACTIONS.CLEAR:
            return {}

        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            // when there's nothing to delete
            if (state.currentOperand == null) return state
            // when there's only one digit to delete
            if (state.currentOperand.lenght === 1) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1)
            }

        case ACTIONS.EVALUATE:
            if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
                return state
            }
            return {
                ...state,
                // to prevent new numbers to appear immmediately after the result without removing the result from the screen
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state)
            }
    }
}

function evaluate({ currentOperand, previousOperand, operation }) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)

    if (isNaN(prev) || isNaN(current)) {
        return ""
    }
    let computation = ""
    switch (operation) {
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current
            break
        case "X":
            computation = prev * current
            break
        case "/":
            computation = prev / current
            break
        case "%":
            computation = prev % current
            break
    }

    return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-in", {
    maximumFractionDigits: 0
})

function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

export default function Calculator() {

    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {})

    return (
        <div className="wrapper">
            <div className="screen">
                <div className="previous-operand">{formatOperand(previousOperand)} {operation}</div>
                <div className="current-operand">{formatOperand(currentOperand)}</div>
            </div>
            <section className="button-wrapper">
                <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
                <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
                <OperationButtons operation="%" dispatch={dispatch}></OperationButtons>
                <OperationButtons operation="/" dispatch={dispatch}></OperationButtons>
                <Buttons digit="7" dispatch={dispatch}></Buttons>
                <Buttons digit="8" dispatch={dispatch}></Buttons>
                <Buttons digit="9" dispatch={dispatch}></Buttons>
                <OperationButtons operation="X" dispatch={dispatch}></OperationButtons>
                <Buttons digit="4" dispatch={dispatch}></Buttons>
                <Buttons digit="5" dispatch={dispatch}></Buttons>
                <Buttons digit="6" dispatch={dispatch}></Buttons>
                <OperationButtons operation="-" dispatch={dispatch}></OperationButtons>
                <Buttons digit="1" dispatch={dispatch}></Buttons>
                <Buttons digit="2" dispatch={dispatch}></Buttons>
                <Buttons digit="3" dispatch={dispatch}></Buttons>
                <OperationButtons operation="+" dispatch={dispatch}></OperationButtons>
                <Buttons digit="0" dispatch={dispatch}></Buttons>
                <Buttons digit="." dispatch={dispatch}></Buttons>
                <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
            </section>
        </div>
    )
}