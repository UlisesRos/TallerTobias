import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Textarea } from '@chakra-ui/react';

const EditModal = ({ isOpen, onClose, registro, onSave }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        modelo: '',
        descripcion: '',
        fechaIngreso: '',
        monto: '',
        proximoServicio: '',
        kmProximoServicio: '',
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
                fechaIngreso: registro.Servicios[0]?.fechaIngreso || '',
                monto: registro.Servicios[0]?.monto || '',
                proximoServicio: registro.Servicios[0]?.proximoServicio || '',
                kmProximoServicio: registro.Servicios[0]?.kmProximoServicio || '',
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
        const { descripcion, fechaIngreso, ...payload } = formData;
        onSave(payload);
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
                        <FormLabel>Motivo de Ingreso</FormLabel>
                        <Textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleChange}
                            isReadOnly
                            bg="gray.100"
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
                        <FormLabel>Próximo Servicio (KM)</FormLabel>
                        <Input
                            name="kmProximoServicio"
                            type="number"
                            value={formData.kmProximoServicio}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Observaciones para próximo servicio</FormLabel>
                        <Textarea
                            name="descripcionProximoServicio"
                            value={formData.descripcionProximoServicio}
                            onChange={handleChange}
                        />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Fecha de Ingreso</FormLabel>
                        <Input
                            name="fechaIngreso"
                            type="date"
                            value={formData.fechaIngreso ? formData.fechaIngreso.slice(0, 10) : ''}
                            isReadOnly
                            bg="gray.100"
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
