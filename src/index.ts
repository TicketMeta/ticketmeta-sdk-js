import {MetaMaskSDK} from "@metamask/sdk";
import {Maybe} from "@metamask/providers/dist/utils";

export class TicketMetaSDK {

    private partnerId: string;
    private MMSDK?: MetaMaskSDK = undefined;

    constructor(partnerId: string) {
        this.partnerId = partnerId;
    }

    async validate(ticketId: string) {
        let accounts = await this.loadAccounts();
        if (accounts == null || accounts.length === 0) {
            return false;
        }
        return this.validateAccounts(accounts as string[], ticketId);
    }

    private async loadAccounts(): Promise<Maybe<string[]>> {
        if (this.MMSDK === undefined) {
            this.MMSDK = new MetaMaskSDK();
        }
        const ethereum = this.MMSDK.getProvider();
        return ethereum?.request({method: 'eth_requestAccounts', params: []});
    }

    private async validateAccounts(accounts: string[], ticketId: string) {
        for (const account of accounts) {
            const result = await fetch("https://api.ticketmeta.io/nft-ticket/check-user-wallet?eventID=" + ticketId + "&userWallet=" + account)
            console.log(result);
            if (result.status >= 400) return false
        }
        return true;
    }
}

export class ValidationResult {
    status: boolean;
    level: string
    constructor(status: boolean, level: string) {
        this.status = status;
        this.level = level;
    }
}

