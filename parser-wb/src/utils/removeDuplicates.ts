export const removeDuplicates = (arr)  => {

    const result = [];
    const duplicatesIndices = [];

    arr.forEach((current, index) => {
    
        if (duplicatesIndices.includes(index)) return;
    
        result.push(current);
    
        // Сравниваем каждый элемент в массиве после текущего
        for (let comparisonIndex = index + 1; comparisonIndex < arr.length; comparisonIndex++) {
        
            const comparison = arr[comparisonIndex];
            const currentKeys = Object.keys(current);
            const comparisonKeys = Object.keys(comparison);
            
            // Проверяем длину массивов
            if (currentKeys.length !== comparisonKeys.length) continue;
            
            // Проверяем значение ключей
            const currentKeysString = currentKeys.sort().join("").toLowerCase();
            console.log(currentKeysString)
            const comparisonKeysString = comparisonKeys.sort().join("").toLowerCase();
            console.log(comparisonKeysString);
            
            if (currentKeysString !== comparisonKeysString) continue;
            
            // Проверяем индексы ключей
            let valuesEqual = true;
            for (let i = 0; i < currentKeys.length; i++) {
                const key = currentKeys[i];
                if ( current[key] !== comparison[key] ) {
                    valuesEqual = false;
                    break;
                }
            }
            if (valuesEqual) duplicatesIndices.push(comparisonIndex);
            
        } // Конец цикла
    });  
    return result;
}