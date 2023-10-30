import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";


interface Props {
  open: boolean
  onClose: () => void
}

export function LocationAccessDeniedDialog(props: Props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.onClose}
        scroll={'paper'}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Location Access</DialogTitle>
        <DialogContent>
          <DialogContentText
            id="scroll-dialog-description"
            tabIndex={-1}
          >
            <strong>How to enable location access:</strong>
            <br />
            Instructions may vary slightly depending on your browser, but generally, you can find the location permission settings under the padlock icon <span>🔒</span> or in the browser's settings/preferences. Look for "Site Settings" or "Permissions" and ensure that location access is allowed for our website.
            <br />
            <br />
            <strong>Why is location access crucial?</strong>
            <br />
            Our platform relies on location data to offer nearby events. By granting access to your location, you allow us to offer you the best possible service.
            <br />
            <br />
            <strong>Privacy and Security:</strong>
            <br />
            We value your privacy, and we want you to feel confident that your location data is handled responsibly. Rest assured that your location information will never be shared with third parties. You can review our privacy policy <a href="#" target="_blank">here</a> to learn more about how we protect your data.
            <br />
            <br />
            <strong>Questions or concerns?</strong>
            <br />
            If you have any questions or encounter difficulties enabling location access, don't hesitate to contact our support team at <a href="mailto:support@example.com">support@example.com</a>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}