from pyteal import *

def approval_program():
    # insurer_key = Bytes("insurer")
    claimer_key = Bytes("claimer")
    vet_key = Bytes("vet_verification")

    is_app_creator = Txn.sender() == Global.creator_address()

    @Subroutine(TealType.none)
    def sendPaymentClaim(receiver: Expr, amount: Expr) -> Expr:
        return Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields(
                {
                    TxnField.type_enum: TxnType.Payment,
                    TxnField.amount: amount,
                    TxnField.receiver: receiver ,
                }
            ),
            InnerTxnBuilder.Submit(),
        )

    on_health =  Seq(
        Assert(is_app_creator),
        If(App.globalGet(vet_key) == Int(1)).Then(
            Seq(
                sendPaymentClaim(App.globalGet(claimer_key), Int(100)),
                Approve(),
            )
        ),
        Reject(),
    )

    days = Btoi(Txn.application_args[2])
    on_care = Seq(
        Assert(is_app_creator),
        If(App.globalGet(vet_key) == Int(1)).Then(
            Seq(
                sendPaymentClaim(App.globalGet(claimer_key),Int(20) * days),
                Approve(),
            )
        ),
        Reject(),
    )

    on_call_method = Txn.application_args[0]
    on_claim = Cond(
        [on_call_method == Bytes("health"), on_health],
        [on_call_method == Bytes("care"), on_care],
    )

    on_create = Seq(
        # App.globalPut(insurer_key, Txn.sender()),
        App.globalPut(claimer_key, Txn.application_args[0]),
        App.globalPut(vet_key, Txn.application_args[1]),
        Approve(),
    )

    return Cond(
        [Txn.application_id() == Int(0), on_create],
        [Txn.on_completion() == OnComplete.NoOp, on_claim],
        [
            Txn.on_completion() == OnComplete.DeleteApplication,
            Return(is_app_creator),
        ],
        # [
        #     Or(
        #         Txn.on_completion() == OnComplete.OptIn,
        #         Txn.on_completion() == OnComplete.CloseOut,
        #         Txn.on_completion() == OnComplete.UpdateApplication,
        #     ),
        #     Reject(),
        # ],
    )

def clear_state_program():
    return Approve()


if __name__ == "__main__":
    with open("public/approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=5)
        f.write(compiled)

    with open("public/clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=5)
        f.write(compiled)
