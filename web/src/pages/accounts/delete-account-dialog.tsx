import { Alert } from "@/components/alert-dialog"

interface DeleteAccountDialogProps {
  onDelete(): void
  disabledOnDelete?: boolean
}

export function DeleteAccountDialog({
  onDelete,
  disabledOnDelete,
}: DeleteAccountDialogProps) {
  return (
    <Alert.Content className="sm:max-w-sm">
      <Alert.Header>
        <Alert.Title>Você deseja excluir a sua conta?</Alert.Title>
        <Alert.Description>Essa ação não pode ser desfeita</Alert.Description>
      </Alert.Header>

      <Alert.Footer>
        <Alert.Cancel>Cancelar</Alert.Cancel>

        <Alert.Action
          onClick={onDelete}
          disabled={disabledOnDelete}
        >
          Deletar conta
        </Alert.Action>
      </Alert.Footer>
    </Alert.Content>
  )
}
