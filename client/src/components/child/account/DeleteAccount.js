import React from "react";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import CloseIcon from "@material-ui/icons/Close";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";

export default function DeleteAccount({
  deleteError,
  handleSubmit,
  error,
  handleRadioChange,
  radioValue
}) {
  return (
    <div className="security__change_password">
      <h3>Delete Account</h3>
      {deleteError !== "" && (
        <Chip
          size="medium"
          label={deleteError}
          disabled
          icon={<CloseIcon />}
          style={{ color: "#FF0000", width: "260px", margin: "1rem 0" }}
          variant="outlined"
        />
      )}
      <form onSubmit={handleSubmit}>
        <FormControl component="fieldset" error={error}>
          <span>
            By deleting your accout you will also delete all the data that is
            assosiated with your account and this action can not be undone. Are
            your sure you want to delete your account?
          </span>
          <RadioGroup
            aria-label="delete account"
            name="delete account"
            onChange={handleRadioChange}
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label="Yes, I am."
            />
          </RadioGroup>
          <Button
            type="submit"
            variant="outlined"
            disabled={Boolean(radioValue === null)}
          >
            Delete My Account
          </Button>
        </FormControl>
      </form>
    </div>
  );
}
