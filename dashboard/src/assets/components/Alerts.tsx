import { Alert, Slide, Snackbar } from "@mui/material"
import { ReactNode } from "react"

interface Props {
    open: boolean
    message: string
    action?: ReactNode
    onClose: () => void
}

function TransitionLeft(props: any) {
    return <Slide {...props} direction="left" />;
}

export function WarningAlert(props: Props) {
    return (
        <Snackbar
            open={props.open}
            autoHideDuration={6000}
            onClose={props.onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={TransitionLeft}>
            <Alert variant="filled" severity="warning" action={props.action ?? undefined}>
                {props.message}
            </Alert>
        </ Snackbar>
    )
}

export function ErrorAlert(props: Props) {
    return (
        <Snackbar
            open={props.open}
            autoHideDuration={6000}
            onClose={props.onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            TransitionComponent={TransitionLeft}>
            <Alert variant="filled" severity="error" action={props.action ?? undefined}>
                {props.message}
            </Alert>
        </ Snackbar>
    )
}