import moment from "moment";
import {HrefType, ManTimeType, TextAndIconType} from "../Model";
import {calculatePercent} from "../utils";

export const textAndIconComparator = (a: TextAndIconType, b: TextAndIconType) => {
    return a.text.localeCompare(b.text);
}

export const keyComparator = (a: HrefType, b: HrefType) => {
    const aNum = parseInt(a.text.substring(a.text.indexOf("-")+1));
    const bNum = parseInt(b.text.substring(b.text.indexOf("-")+1));
    return aNum - bNum;
}

export const dateComparator = (a: string, b: string) => {
    const aValue = moment(a).valueOf() || 0;
    const bValue = moment(b).valueOf() || 0;
    return aValue - bValue;
}

export const manTimeComparator = (a: ManTimeType, b: ManTimeType) => {
    return calculatePercent(a) - calculatePercent(b) || a.fact - b.fact || a.initial - b.initial;
}