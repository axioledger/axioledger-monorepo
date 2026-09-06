# Axioledger Architecture Flowcharts

---

## 1. Core axioledger Data Flow

The fundamental unidirectional data flow of the Axioledger DApp engine:

```mermaid
graph TD
    init("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;init&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
    init --- |"init:{state}<br/>init:[state, effect(s)]<br/>"|j0[ ] --- j1[ ] -->nextState
    init --> |"init:Action<br/>init:[Action, payload?]"|Action

    domevent("DOM/synthetic&nbsp;<br/>events<br/>&nbsp;(click/myevent)&nbsp;") --> viewEvent
    viewEvent(("&nbsp;&nbsp;&nbsp;&nbsp;view&nbsp;&nbsp;&nbsp;&nbsp;<br/>event")) --> Action
    externalEvents("global/external<br/>processes<br/>&nbsp;(window resize)&nbsp;") --> subscription
    subscription(("subscription")) -->Action

    Action["&nbsp;Action&nbsp;<br/>(state change)"] -->|"OtherAction<br/>&nbsp;[OtherAction, payload?]<br/>"|Action
    Action --- |"NextState<br/>[NextState, ...Effects]"|j2[ ] ---> nextState
    
    nextState(("&nbsp;&nbsp;next&nbsp;&nbsp;<br/>state")) --- j3[ ]
    j3 --> |"view(state)"|newDom("&nbsp;&nbsp;&nbsp;(re)render&nbsp;&nbsp;<br/>&nbsp;&nbsp;&nbsp;&nbsp;DOM&nbsp;&nbsp;&nbsp;")
    j3 --> |"subscriptions(state)"|recalcSubs(recalc<br/>subscriptions)
    j3 --> |"(dispatch, Payload?) -> void"|effect
    effect("Effects<br>(impure code)") -.-> |"dispatch"|dispatchAction("Action")
    
    style j0 height:1px;
    style j0 width:1px;
    style j1 height:1px;
    style j1 width:1px;
    style j2 height:1px;
    style j2 width:1px;
    style j3 height:1px;
    style j3 width:1px;
```

---

## 2. AxioPass Authentication Flow

The full user authentication lifecycle — from cold start to authenticated session:

```mermaid
flowchart TD
    A([App Launch]) --> B{Saved session?}
    B -- No --> C[Splash Screen]
    B -- Yes --> D[loadSession effect]
    D --> E{Session valid?}
    E -- Yes --> AUTHED([Authenticated Home])
    E -- No --> C
    C --> F[Onboarding v1 / v2]
    F --> G[Registration Screen]
    G --> H[OTP Screen\n6-digit code]
    H --> I{OTP valid?}
    I -- No --> H
    I -- Yes --> J[PIN Setup\n6-dot keypad]
    J --> K[WebAuthn / Biometric\nPasskey Registration]
    K --> L{Passkey saved?}
    L -- No --> K
    L -- Yes --> AUTHED

    AUTHED --> M{Screen Route}
    M --> N[Home Zone\n#49DBC8]
    M --> O[Crypto Zone\n#49DBC8]
    M --> P[Card Zone\n#AF96FB]
    M --> Q[Cashback Zone\n#BEFF6C]
    M --> R[More Zone\n#F5F5F5]
```

---

## 3. Axioledger Cross-Chain Transaction Flow

A complete journey of a user-initiated cross-chain transfer from L2 (Sequentichain) to L1 (Axioledger mainnet):

```mermaid
flowchart LR
    subgraph AxioPass["AxioPass Wallet (UI)"]
        U([User]) -->|"1. Enter amount\n$AXQ string"| TX[TransferIntent\nAction]
        TX -->|"2. Build StatelessTx"| SIGN[Sign with Passkey\nWebAuthn P-256]
        SIGN -->|"3. Merkle Witness\nattached"| SUBMIT[broadcastStatelessTx\nEffect]
    end

    subgraph L2["L2 · Sequentichain ($SQX)"]
        SUBMIT -->|"4. Submit Tx"| SEQ[Sequencer\nAF_XDP Socket]
        SEQ -->|"5. Batch aggregate"| BATCH[Batch Aggregator]
        BATCH -->|"6. ZK-SNARK commit"| ZKC[ZK State\nCommitment]
    end

    subgraph ZKLayer["ZK Infrastructure · Veraciphers ($VRQ)"]
        ZKC -->|"7. Generate proof"| PROVER[Off-chain Prover\nGPU / FPGA]
        PROVER -->|"8. Proof submitted"| VERIFY[On-chain Verifier\nContract]
    end

    subgraph L1["L1 · Axioledger Mainnet ($AXQ)"]
        VERIFY -->|"9. Proof valid"| FINALISE[State Root\nAttestation]
        FINALISE -->|"10. Block committed"| LEDGER[(Merkle Patricia\nTrie)]
        LEDGER -->|"11. Event emitted"| RECEIPT[Tx Receipt\nIndexed]
    end

    subgraph Wallet["Wallet State Update"]
        RECEIPT -->|"12. WebSocket event"| WS[ReceiveL2Event\nSubscription]
        WS -->|"13. Dispatch"| UPDATE[UpdateBalance\nAction]
        UPDATE -->|"14. Re-render"| UI[Balance Display\nUpdated]
    end
```

---

## 4. ZK-KYC Identity Verification Flow

How AxioPass performs privacy-preserving KYC via ZK-DID and $VRQ:

```mermaid
flowchart TD
    subgraph User["User Device (AxioPass)"]
        A([User]) -->|"Uploads document"| B[KYC Camera\nInspection]
        B -->|"Local hash"| C[ZK Witness\nGeneration]
        C -->|"Selective disclosure"| D[ZK Proof\nBundle]
    end

    subgraph Issuer["Enterprise Identity Issuer ($VRQ)"]
        D -->|"Submit proof"| E[Verifier\nPortal]
        E -->|"Verify circuit"| F{Valid?}
        F -- No --> G([Rejection])
        F -- Yes --> H[Issue SBT\nSoulbound Token]
    end

    subgraph Chain["On-chain Registry"]
        H -->|"Mint SBT"| I[ZK-DID Registry\n.axq namespace]
        I -->|"Emit event"| J[KYC Verified\nStatus On-chain]
    end

    subgraph Wallet2["AxioPass State"]
        J -->|"WebSocket event"| K[SetKycStatus\nAction]
        K --> L[KYC Gate\nUnlocked]
        L --> M([Access to\nSensitive Features])
    end
```

---

## 5. Tokenomics Flow — 5-Token Proof-of-Lock System

How users lock $AXQ to mint and use utility sub-tokens:

```mermaid
flowchart TD
    AXQ(["$AXQ\n10 Trillion Total Supply"])

    AXQ -->|"Stake / Lock"| POL{Proof-of-Lock\nEngine}

    POL -->|"Run Validator Node\n4C/8GB minimum"| VPX(["$VPX\nValidator Staking\n15% supply"])
    POL -->|"Run L2 Sequencer\nAF_XDP stack"| SQX(["$SQX\nSequencer Gas\n10% supply"])
    POL -->|"Provide Liquidity\nCLAMM pools"| KPX(["$KPX\nKinetoprotocol LP\n35% supply"])
    POL -->|"Run ZK Prover\nGPU/FPGA cluster"| VRQ(["$VRQ\nZK Proof Fees\n15% supply"])

    VPX -->|"Block rewards\n10-year linear"| REWARDS["Node Revenue\nLedger"]
    SQX -->|"50% gas burned\n50% to sequencer"| BURN["Permanent\n$AXQ Burn"]
    KPX -->|"0.1% swap fee"| TREASURY["Treasury\nBuyback Reserve"]
    VRQ -->|"Proof fees\n0.1-0.5% royalty"| BURN

    TREASURY -->|"Auto buyback & burn"| BURN
    BURN -->|"Deflationary pressure"| AXQ
```

---

## 6. AxioPass Screen State Machine (5-Zone Router)

The finite-state machine governing screen navigation in AxioPass:

```mermaid
stateDiagram-v2
    [*] --> splash

    splash --> onboarding_1 : first launch
    splash --> home : session restored

    onboarding_1 --> onboarding_2
    onboarding_2 --> registration

    registration --> otp : submit phone
    otp --> pin_setup : OTP verified (6-digit)
    pin_setup --> biometric : PIN set (6-dot)
    biometric --> home : passkey registered

    home --> crypto     : tap Crypto tab
    home --> card       : tap Card tab
    home --> cashback   : tap Cashback tab
    home --> more       : tap More tab
    home --> add_balance: tap + Add
    home --> services   : tap Services

    crypto --> wallet_detail : tap token
    crypto --> swap          : tap Swap
    crypto --> trade         : tap Trade

    card --> card_flipped : tap flip
    card --> pay_debt     : tap Pay Debt

    cashback --> cashback_history : tap History

    more --> profile      : tap Profile
    more --> edit_profile : tap Edit
    more --> settings     : tap Settings
    more --> notifications: tap Notifications
    more --> faq          : tap FAQ
    more --> language     : tap Language
    more --> appearance   : tap Appearance

    transfer --> transfer_to  : enter amount
    transfer_to --> success   : confirm send
    success --> home          : tap OK
```

---

## 7. DAO Dual-Chamber Governance Flow

How $AXQ holders and $VPX operators jointly govern Axioledger:

```mermaid
flowchart TD
    subgraph House["House of Holders — $AXQ Stakers"]
        H1([Proposal\nSubmitted]) --> H2[Community\nDiscussion]
        H2 --> H3{Quorum\nReached?}
        H3 -- No --> H2
        H3 -- Yes --> H4[House Vote\n$AXQ Weighted]
        H4 --> H5{Vote Passes\n>50%?}
        H5 -- No --> REJECT1([Rejected])
        H5 -- Yes --> CROSS[Cross-Chamber\nResolution]
    end

    subgraph Senate["Senate of Operators — $VPX Nodes"]
        CROSS --> S1[Senate Review\n$VPX Weighted]
        S1 --> S2{Senate Passes\n>67%?}
        S2 -- No --> VETO([Senate Veto])
        S2 -- Yes --> TIMELOCK[Timelock\nController\n48h delay]
    end

    subgraph Execution["On-chain Execution"]
        TIMELOCK --> EXEC{Emergency\nVeto Window?}
        EXEC -- Vetoed --> CANCEL([Cancelled])
        EXEC -- Passed --> UPGRADE[WASM Runtime\nPatch Applied]
        UPGRADE --> TELEMETRY[Node Version\nTelemetry]
    end

    subgraph Decay["Governance Decay Engine D(t)"]
        INACTIVE([Inactive Holder\nDetected]) --> DECAY[Apply D(t)\nDecay Function]
        DECAY --> HAIRCUT[Asset Haircut\n1%/3%/5% threshold]
        HAIRCUT --> SUPPRESS[Whale Voting\nSuppressed]
    end
```
