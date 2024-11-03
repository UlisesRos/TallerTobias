import { Modal, ModalOverlay, ModalCloseButton, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, Stack } from "@chakra-ui/react"

const ClienteModal = ({isOpen, onClose, clienteSeleccionado}) => {
        
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent w='80%'>
                    <ModalHeader
                        textAlign='center'
                        >
                        Datos Personales
                    </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Stack spacing={4}>
                        <Text
                            textTransform='capitalize'
                            >
                            <strong>Nombre:</strong> {clienteSeleccionado.nombre}
                        </Text>
                        <Text>
                            <strong>Telefono:</strong> {clienteSeleccionado.telefono}
                        </Text>
                        <Text>
                            <strong>Email:</strong> {clienteSeleccionado.email ? clienteSeleccionado.email : '-'}
                        </Text>
                    </Stack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ClienteModal