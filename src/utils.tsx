import _ from "lodash";
import {ManTimeType} from "./Model";

export const splitList = (list: any[], chunksCount: number, overflowAlign: "left" | "right" = "left"): any[] => {
    if (chunksCount <= 1) {
        return [list];
    }

    let chunkSizes: number[] = [];
    for (let i = 0; i < chunksCount; i++) {
        chunkSizes.push(0)
    }
    for (let i = 0; i < list.length; i++) {
        let chunk;
        if (overflowAlign === "left") {
            chunk = i % chunkSizes.length
        } else {
            chunk = chunkSizes.length - 1 - (i % chunkSizes.length)
        }
        chunkSizes[chunk] += 1;
    }

    let result: any[][] = [];
    let i = 0;
    for (let j = 0; j < chunkSizes.length; j++) {
        let chunk: any[] = [];
        for (let k = 0; k < chunkSizes[j]; k++) {
            chunk.push(list[i++]);
        }
        result.push(chunk);
    }

    return result;
}

export const parseJSON = (value: any): any => {
    try {
        return JSON.parse(value);
    } catch (e) {
    }
    return value;
}

export const getValueWithHighestIntegerKey = (obj: {[key: string]: any}): any => {
    if (!obj) {
        return null;
    }
    const sortedEntries = Object.entries(obj).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    if (sortedEntries.length === 0) {
        return null;
    }
    return sortedEntries[sortedEntries.length-1][1];
    // return sortedEntries[0][1];
}

export const jqlEqualsOrIn = (values: string[]): string => {
    if (values.length === 1) {
        return "= " + values[0];
    } else {
        return "in (" + values.join(", ") + ")";
    }
}

export const jqlEscapeString = (value: string): string => {
    return "'" + value.replace("'", "\\'") + "'";
}

export const secondsToManTimeString = (seconds: number): string => {
    if (!seconds) {
        return "—";
    }
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    let days = Math.floor(hours / 8);
    let weeks = Math.floor(days / 5);
    seconds = seconds % 60;
    minutes = minutes % 60;
    hours = hours % 8;
    days = days % 5;

    let sb: string[] = [];
    if (weeks) {
        sb.push(weeks + "w");
    }
    if (days) {
        sb.push(days + "d");
    }
    if (hours) {
        sb.push(hours + "h");
    }
    if (minutes) {
        sb.push(minutes + "m");
    }
    if (seconds) {
        sb.push(seconds + "s");
    }
    return sb.join(" ") || "—";
}

export const calculatePercent = (value: ManTimeType): number => {
    let percent = Math.round(value.fact / value.initial * 100);
    if (!_.isSafeInteger(percent)) {
        percent = 0;
    }
    return percent;
}