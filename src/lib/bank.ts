/**
 * Bank-transfer payment accounts.
 *
 * These numbers are displayed to customers at checkout so they can pay us —
 * they're public by design, so we keep them in the repo as plain config rather
 * than env vars. Add or edit entries below; ids are assigned automatically in
 * declaration order, so the checkout dropdown stays stable.
 */
export interface BankAccount {
  /** Stable id used as the <select> value, e.g. "1". */
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

const ACCOUNTS: Omit<BankAccount, "id">[] = [
  {
    bankName: "Commercial Bank",
    accountName: "Serendib Prime Seafood (Pvt) Ltd",
    accountNumber: "1000493465",
    branch: "Negombo",
  },
  {
    bankName: "HNB Bank",
    accountName: "Serendib Prime Seafood (Pvt) Ltd",
    accountNumber: "024010044632",
    branch: "Negombo",
  },
];

/** All configured owner accounts, in declaration order. */
export function getBankAccounts(): BankAccount[] {
  return ACCOUNTS.map((a, i) => ({ ...a, id: String(i + 1) }));
}

/** Look up one account by its id (the <select> value). */
export function getBankAccountById(id: string): BankAccount | undefined {
  return getBankAccounts().find((a) => a.id === id);
}

/** Short human label stored on the order, e.g. "Commercial Bank · 1000493465". */
export function bankAccountLabel(account: BankAccount): string {
  return `${account.bankName} · ${account.accountNumber}`;
}

export function isBankTransferConfigured(): boolean {
  return getBankAccounts().length > 0;
}
