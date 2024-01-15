import React from "react";
import './Popup.css'
import { Button } from "@dhis2/ui";


function Popup(props) {
  return props.trigger ? (
    <div className='popup'>
      <div className='popup-inner'>
        <div className='popup-inner-inner'>
          <h1>{props.popupHeading}</h1>
          <Button
            className='close-btn'
            onClick={() => props.setTrigger(false)}
            destructive
            value="default"
          >
            Close
          </Button> </div>
        {props.children}
      </div>
    </div>
  ) : null;
}

export default Popup;