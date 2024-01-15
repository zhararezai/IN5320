import React from "react";
import classes from "../App.module.css";
import { useState } from "react";
import { Overview } from "./Overview";
import { Commodities } from "./Commodities";
import { Navigation } from "./Navigation";
import { Dispense } from "./Dispense";
import { Recount } from "./Recount";
import { Replenish } from "./Replenish";

export function PageRouter() {

    const [activePage, setActivePage] = useState("Overview");
    function activePageHandler(page) {
        setActivePage(page);
    }

    return (
        <div className={classes.container}>
            <div className={classes.left}>
                <Navigation
                    activePage={activePage}
                    activePageHandler={activePageHandler}
                />
            </div>
            <div className={classes.right}>
                {activePage === "Overview" && <Overview />}
                {activePage === "Commodities" && <Commodities />}
                {activePage === "Dispense" && <Dispense />}
                {activePage === "Recount" && <Recount />}
                {activePage === "Replenish" && <Replenish/>}
            </div>
        </div>
    );
}

