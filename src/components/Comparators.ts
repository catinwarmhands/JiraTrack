import moment from "moment";

type NameAndIconType = {name: string, iconUrl: string};
type KeyType = {code: string, href: string};

export const nameAndIconComparator = (a: NameAndIconType, b: NameAndIconType) => {
    return a.name.localeCompare(b.name);
}

export const keyComparator = (a: KeyType, b: KeyType) => {
    const aNum = parseInt(a.code.substring(a.code.indexOf("-")+1));
    const bNum = parseInt(b.code.substring(b.code.indexOf("-")+1));
    return aNum - bNum;
}

export const dateComparator = (a: string, b: string) => {
    const aValue = moment(a).valueOf() || 0;
    const bValue = moment(b).valueOf() || 0;
    return aValue - bValue;
}