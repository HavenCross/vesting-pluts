import { Address, bool, bs, compile, data, int, lam, makeValidator, papp, PaymentCredentials, pBool, pfn, phoist, pif, pintToBS, plet, pmatch, precursive, PScriptContext, pStr, ptrace, ptraceIfFalse, punsafeConvertType, Script, ScriptType } from "@harmoniclabs/plu-ts";
import VestingDatum from "./VestingDatum";

export const contract = pfn([
    VestingDatum.type,
    data,
    PScriptContext.type
],  bool)
(( datum, _redeemer, ctx ) => {

    // inlined
    const signedByBeneficiary = ctx.tx.signatories.some( datum.beneficiary.eqTerm );

    // inlined
    const deadlineReached = 
        pmatch( ctx.tx.interval.from.bound )
        .onPFinite(({ _0: lowerInterval }) =>
                datum.deadline.ltEq( lowerInterval ) 
        )
        ._( _ => pBool( false ) )

    return signedByBeneficiary.and( deadlineReached );
});

///////////////////////////////////////////////////////////////////
// ------------------------------------------------------------- //
// ------------------------- utilities ------------------------- //
// ------------------------------------------------------------- //
///////////////////////////////////////////////////////////////////

export const untypedValidator = makeValidator( contract );

export const compiledContract = compile( untypedValidator );

export const script = new Script(
    ScriptType.PlutusV2,
    compiledContract
);

export const scriptMainnetAddr = new Address(
    "mainnet",
    PaymentCredentials.script( script.hash )
);

export const scriptTestnetAddr = new Address(
    "testnet",
    PaymentCredentials.script( script.hash )
);

export default contract;