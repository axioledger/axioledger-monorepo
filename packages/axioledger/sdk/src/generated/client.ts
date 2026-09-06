/**
 * @axioledger/sdk/client — Axioledger Stargate Client
 * STUB: Thay thế bằng generated code sau khi có .proto files
 */

export interface AxioledgerClientConfig {
    rpcEndpoint: string
    prefix?: string   // default: "axio"
}

export interface SigningConfig extends AxioledgerClientConfig {
    mnemonic?: string
    privateKey?: Uint8Array
}

/** Stub class — replaced by Telescope-generated StargateClient */
export class AxioledgerQueryClient {
    constructor(public readonly config: AxioledgerClientConfig) {}
    async getBalance(address: string, denom: string): Promise<{ denom: string; amount: string }> {
        throw new Error("Stub — connect to live RPC endpoint")
    }
    async getAccount(address: string): Promise<{ address: string; sequence: bigint; account_number: bigint }> {
        throw new Error("Stub — connect to live RPC endpoint")
    }
}
