from pyteal import *

def approval_program():
    # claimer_key = Bytes("claimer")
    vet_key = Bytes("vet_confirmation")

    is_app_creator = Txn.sender() == Global.creator_address()
    # is_receiver = Txn.accounts[1] == App.globalGet(claimer_key)

    @Subroutine(TealType.none)
    def sendPaymentClaim(amount: Expr) -> Expr:
        return Seq(
            InnerTxnBuilder.Begin(),
            InnerTxnBuilder.SetFields(
                {
                    TxnField.type_enum: TxnType.Payment,
                    TxnField.amount: amount,
                    TxnField.receiver: Txn.accounts[1] ,
                }
            ),
            InnerTxnBuilder.Submit(),
        )

    doctor_approvement = ScratchVar(TealType.uint64)
    on_health =  Seq(
        Assert(is_app_creator),
        # Assert(is_receiver),
        doctor_approvement.store(Btoi(Txn.application_args[1])),
        Assert(doctor_approvement.load() == Int(1)),
        sendPaymentClaim(Int(100)),
        Approve(),
    )

    stay_days = ScratchVar(TealType.uint64)
    on_care = Seq(
        Assert(is_app_creator),
        # Assert(is_receiver),
        doctor_approvement.store(Btoi(Txn.application_args[1])),
        stay_days.store(Btoi(Txn.application_args[2])),
        Assert(doctor_approvement.load() == Int(1)),

        sendPaymentClaim(Int(20) * stay_days.load()),
        Approve(),
    )

    on_call_method = Txn.application_args[0]
    on_claim = Cond(
        [on_call_method == Bytes("health"), on_health],
        [on_call_method == Bytes("care"), on_care],
    )

    on_create = Seq(
        App.globalPut(Txn.sender(), Global.creator_address()),
        App.globalPut(Txn.receiver(), Txn.application_args[0]),
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
