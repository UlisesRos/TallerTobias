import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';

const EditModal = ({ isOpen, onClose, registro, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        modelo: '',
        descripcion: '',
        monto: '',
        proximoServicio: '',
        descripcionProximoServicio: '',
        fechaEntrega: '',
    });

    useEffect(() => {
        if (registro) {
            setFormData({
                nombre: registro.nombre || '',
                marca: registro.Motos[0]?.marca || '',
                modelo: registro.Motos[0]?.modelo || '',
                descripcion: registro.Servicios[0]?.descripcion || '',
                monto: registro.Servicios[0]?.monto || '',
                proximoServicio: registro.Servicios[0]?.proximoServicio || '',
                descripcionProximoServicio: registro.Servicios[0]?.descripcionProximoServicio || '',
                fechaEntrega: registro.Servicios[0]?.fechaEntrega || '',
            });
        }
    }, [registro]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Editar Registro</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Nombre</FormLabel>
                        <Input
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Marca</FormLabel>
                        <Input
                            name="marca"
                            value={formData.marca}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Modelo</FormLabel>
                        <Input
                            name="modelo"
                            value={formData.modelo}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Descripción Servicio</FormLabel>
                        <Textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Monto</FormLabel>
                        <Input
                            name="monto"
                            type="number"
                            value={formData.monto}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Próximo Servicio (Días)</FormLabel>
                        <Input
                            name="proximoServicio"
                            type="number"
                            value={formData.proximoServicio}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Descripción Próximo Servicio</FormLabel>
                        <Textarea
                            name="descripcionProximoServicio"
                            value={formData.descripcionProximoServicio}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Fecha Entrega</FormLabel>
                        <Input
                            name="fechaEntrega"
                            type="date"
                            value={formData.fechaEntrega}
                            onChange={handleChange}
                        />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button colorScheme="blue" onClick={handleSubmit}>Guardar</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default EditModal;
