import { existsSync } from "fs";
import { cli } from "./app/utils/cli";
import { script } from "./contract";
import { mkdir } from "fs/promises";

console.log("validator compiled succesfully! 🎉\n");
console.log(
    JSON.stringify(
        script.toJson(),
        undefined,
        2
    )
);

async function main() 
{
    if( !existsSync("./testnet") )
    {
        await mkdir("./testnet");
    }
    cli.utils.writeScript( script, "./testnet/vesting.plutus.json")
}
main();