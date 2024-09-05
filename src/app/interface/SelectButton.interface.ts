import React from "react";

export interface ISelectButtonInterface {
    firstOption: string,
    lastOption: string,
    type: boolean,
    state: React.Dispatch<React.SetStateAction<boolean>>
}