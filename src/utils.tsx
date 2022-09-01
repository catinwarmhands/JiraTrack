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
        console.log("chunk", chunk)
        chunkSizes[chunk] += 1;
    }
    console.log(chunkSizes);
    // let counter = 0;
    // while (counter < list.length) {
    //     for (let i = chunkSizes.length - 1; i >= 0; i--) {
    //         if (counter === list.length) {
    //             break;
    //         }
    //         chunkSizes[i] += 1;
    //         counter += 1;
    //     }
    // }

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