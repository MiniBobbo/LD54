import { MapData } from "./MapData";

export class TestHelper {
    //How long should we search before we give up?  
    static testLength:number = 1000;

    //This could be smarter by saving the game state and looking for duplicates, but that seems like a lot of work.
    //Brute force is easier...  We will see how this works...


    /**
     * Generate a list of all possible instructions for a given length and steps.  This uses recursion and is scary. 
     * @param steps An array of steps to include.  So [0,1,3] will not include step 2 in the list.
     * @param length How long the instructions are allowed to be.  So 3 would generate [0,0,0] to [3,3,3] given steps [0,3]
     * @param currentList Recursion
     * @param results Recursion
     * @returns Full list
     */
    static generateInstructionLists(steps: number[], length: number, currentList: number[] = [], results: number[][] = []): number[][] {
        // If the current list is of the desired length, add it to the results
        if (currentList.length === length) {
            results.push([...currentList]);
            return results;
        }
    
        // Recursively generate instruction lists by adding each step from the given list
        // and exploring all possible combinations
        for (const step of steps) {
            currentList.push(step);
            this.generateInstructionLists(steps, length, currentList, results);
            currentList.pop(); // Remove the last element for backtracking
        }
    
        return results;
    }

    static TestInstructions(md:MapData, inst:number[]):TestResults {
        md.Reset();
        let r = new TestResults();
        r.instructions = [...inst];
        r.name = md.name;
        let currentinst = [...inst];

        while(!r.success && r.steps < this.testLength) {
            r.steps++;
            if(currentinst.length == 0)
            currentinst = [...inst];
            md.Step();
            if(md.complete)
                r.success = true;
        }

        return r;
    }
}

export class TestResults {
    name:string = 'test';
    success:boolean = false;
    steps:number = 0;
    instructions:number[];
}