import { existsSync } from "fs";
import { cli } from "./utils/cli";
import { Address, PaymentCredentials } from "@harmoniclabs/plu-ts";
import { config } from "dotenv";
import { mkdir } from "fs/promises";

config();

async function genKeys()
{
    const nKeys = 2;

    const promises: Promise<any>[] = [];

    if( !existsSync("./testnet") )
    {
        await mkdir("./testnet");
    }
    
    for( let i = 1; i <= nKeys; i++ )
    {
        const { privateKey, publicKey } = await cli.address.keyGen();
        const addr = new Address(
            "testnet",
            PaymentCredentials.pubKey( publicKey.hash )
        );
        
        promises.push(
            cli.utils.writeAddress( addr, `./testnet/address${i}.addr` ),
            cli.utils.writePublicKey( publicKey, `./testnet/payment${i}.vkey` ),
            cli.utils.writePrivateKey( privateKey, `./testnet/payment${i}.skey` )
        );
    }

    // wait for all files to be copied
    await Promise.all( promises );
}
genKeys();