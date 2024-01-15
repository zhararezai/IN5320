import React from "react";
import { Menu, MenuItem } from "@dhis2/ui";

export function Navigation(props) {
  return (
    <Menu>
      <MenuItem
        label="Overview"
        active={props.activePage == "Overview"}
        onClick={() => props.activePageHandler("Overview")}
      />
      <MenuItem
        label="Commodities"
        active={props.activePage == "Commodities"}
        onClick={() => props.activePageHandler("Commodities")}
      />
      <MenuItem
        label="Dispense"
        active={props.activePage == "Dispense"}
        onClick={() => props.activePageHandler("Dispense")}
      />
      <MenuItem
        label="Replenish"
        active={props.activePage == "Replenish"}
        onClick={() => props.activePageHandler("Replenish")}
      />
      <MenuItem
        label="Recount"
        active={props.activePage == "Recount"}
        onClick={() => props.activePageHandler("Recount")}
      />
    </Menu>
  );
}

