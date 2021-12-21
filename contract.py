from pyteal import *

def approval_program():
    is_app_creator = Txn.sender() == Global.creator_address()

    @Subroutine(TealType.none)
    def sendPaymentClaim(receiver: TealType.bytes, amount: TealType.uint64):
        return Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields(
                {
                    TxnField.type_enum: TxnType.Payment,
                    TxnField.sender: Global.current_application_address(),
                    TxnField.amount: amount,
                    TxnField.receiver: receiver,
                }
            ),
            InnerTxnBuilder.Submit(),
        )


    doctor_approvement = ScratchVar(TealType.uint64)
    receiver_wallet = ScratchVar(TealType.bytes)
    on_health =  Seq(
        receiver_wallet.store(Txn.application_args[1]),
        doctor_approvement.store(Btoi(Txn.application_args[2])),
        If(doctor_approvement.load() == Int(1)).Then(
            Seq(
                sendPaymentClaim(receiver_wallet.load(), Int(100000)),
                Approve(),
            )
        ),
        Reject(),
    )

    stay_days = ScratchVar(TealType.uint64)
    on_care = Seq(
        receiver_wallet.store(Txn.application_args[1]),
        doctor_approvement.store(Btoi(Txn.application_args[2])),
        stay_days.store(Btoi(Txn.application_args[3])),
        If(doctor_approvement.load() == Int(1)).Then(
            Seq(
                sendPaymentClaim(receiver_wallet.load(), Int(500) * stay_days.load()),
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
        App.globalPut(Txn.sender(), Global.creator_address()),
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
    with open("public/mini_approval.teal", "w") as f:
        compiled = compileTeal(approval_program(), mode=Mode.Application, version=5)
        f.write(compiled)

    with open("public/clear_state.teal", "w") as f:
        compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=5)
        f.write(compiled)
