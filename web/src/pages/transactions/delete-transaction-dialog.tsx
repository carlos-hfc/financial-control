import { Alert } from "@/components/alert-dialog"

interface DeleteTransactionDialogProps {
  onDelete(): void
  disabledOnDelete?: boolean
}

export function DeleteTransactionDialog({
  onDelete,
  disabledOnDelete,
}: DeleteTransactionDialogProps) {
  return (
    <Alert.Content className="sm:max-w-sm">
      <Alert.Header>
        <Alert.Title>Você deseja excluir a transação?</Alert.Title>
        <Alert.Description>Essa ação não pode ser desfeita</Alert.Description>
      </Alert.Header>

      <Alert.Footer>
        <Alert.Cancel>Cancelar</Alert.Cancel>

        <Alert.Action
          onClick={onDelete}
          disabled={disabledOnDelete}
        >
          Deletar transação
        </Alert.Action>
      </Alert.Footer>
    </Alert.Content>
  )
}
