import styles from './Tab.module.sass'
import InputText from "@/components/InputText";
import SelectOption from "@/components/SelectOption";
import {ITab} from "@/interface/Tab.interface";

export default function Tab(props: ITab){

    return(
        <div className={styles.container}>
            <InputText
                placeholder={props.searchPlaceholder}
                value={props.searchValue}
                state={props.searchState}
                icon={props.searchIcon}
                type='input'
                white={true}
                width={props.searchWidth}
            />
            <SelectOption
                placeholder={props.firstSelectOptionPlaceholder}
                active={props.firstSelectOptionActive}
                options={props.firstSelectOptionOptions}
                setActive={props.firstSelectOptionSetActive}
                width="20%"
                value={props.firstSelectOptionValue}
                setValue={props.firstSelectOptionSetValue}
            />
            <SelectOption
                placeholder={props.secondSelectOptionPlaceholder}
                active={props.secondSelectOptionActive}
                options={props.secondSelectOptionOptions}
                setActive={props.secondSelectOptionSetActive}
                width="20%"
                value={props.secondSelectOptionValue}
                setValue={props.secondSelectOptionSetValue}
            />
            <button
                onClick={() => props.buttonAction(true)}
                className={styles.container__new}>{props.buttonText}</button>
        </div>
    )
}