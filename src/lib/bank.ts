/**
 * Bank-transfer payment accounts.
 *
 * Accounts are read from server-side env vars so the real numbers never land in
 * the repo. Supports multiple owner accounts via a numbered scheme so the
 * checkout can offer a dropdown:
 *
 *   BANK_1_NAME, BANK_1_ACCOUNT_NAME, BANK_1_ACCOUNT_NUMBER, BANK_1_BRANCH
 *   BANK_2_NAME, ...
 *
 * The legacy single-account vars (BANK_NAME, BANK_ACCOUNT_NUMBER, …) are still
 * honoured and surface as the first account.
 */
export interface BankAccount {
  /** Stable id used as the <select> value, e.g. "1". */
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branch: string;
}

const MAX_ACCOUNTS = 10;

function readAccount(prefix: string): Omit<BankAccount, "id"> | null {
  const bankName = process.env[`${prefix}_NAME`];
  const accountNumber = process.env[`${prefix}_ACCOUNT_NUMBER`];
  if (!bankName || !accountNumber) return null;
  return {
    bankName,
    accountName: process.env[`${prefix}_ACCOUNT_NAME`] || "",
    accountNumber,
    branch: process.env[`${prefix}_BRANCH`] || "",
  };
}

/** All configured owner accounts, in declaration order. */
export function getBankAccounts(): BankAccount[] {
  const accounts: BankAccount[] = [];
  const push = (a: Omit<BankAccount, "id"> | null) => {
    if (a) accounts.push({ ...a, id: String(accounts.length + 1) });
  };

  push(readAccount("BANK")); // legacy single-account vars
  for (let i = 1; i <= MAX_ACCOUNTS; i++) push(readAccount(`BANK_${i}`));

  return accounts;
}

/** Look up one account by its id (the <select> value). */
export function getBankAccountById(id: string): BankAccount | undefined {
  return getBankAccounts().find((a) => a.id === id);
}

/** Short human label stored on the order, e.g. "BOC · 1234567890". */
export function bankAccountLabel(account: BankAccount): string {
  return `${account.bankName} · ${account.accountNumber}`;
}

export function isBankTransferConfigured(): boolean {
  return getBankAccounts().length > 0;
}
