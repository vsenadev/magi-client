import React from "react";
import {IOption} from "@/interface/SelectOption.interface";

export interface ITab {
    searchPlaceholder: string;
    searchValue: string;
    searchState: React.Dispatch<React.SetStateAction<string>>;
    searchIcon: string;
    searchType: string;
    searchWidth: string;
    firstSelectOptionPlaceholder: string;
    firstSelectOptionActive: boolean;
    firstSelectOptionOptions: IOption[];
    firstSelectOptionSetActive: React.Dispatch<React.SetStateAction<boolean>>;
    firstSelectOptionValue: string;
    firstSelectOptionSetValue: React.Dispatch<React.SetStateAction<string>>;
    secondSelectOptionPlaceholder: string;
    secondSelectOptionActive: boolean;
    secondSelectOptionOptions: IOption[];
    secondSelectOptionSetActive: React.Dispatch<React.SetStateAction<boolean>>;
    secondSelectOptionValue: string;
    secondSelectOptionSetValue: React.Dispatch<React.SetStateAction<string>>;
    buttonText: string;
}