import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Select,
    Input,
    Divider,
    Flex,
    Spinner,
    Text
} from '@chakra-ui/react';

const DatosServicioModal = ({ isOpen, onClose, clienteId, clienteNombre, apiRender }) => {
    // Función para obtener el estado inicial vacío
    const getEstadoInicial = (id) => ({
        clienteId: id,
        // Lubricado
        cambioAceiteMotor: '',
        tipoAceite: '',
        cambioFiltroAceite: '',
        cambioFiltroAire: '',
        cambioFiltroCombustible: '',
        cambioMangueras: '',
        // Sistema Eléctrico
        diagnosticoBateria: '',
        voltajeBateria: '',
        revisionRegulador: '',
        revisionSistemaLuces: '',
        focosEnMalEstado: '',
        fichasRecambio: '',
        terminalesRecambio: '',
        revisionFugas: '',
        reparacionCablesDanados: '',
        // Transmisión
        cambioTransmision: '',
        reduccionCadena: '',
        cambioTornillosCorona: '',
        cantidadTornillos: '',
        cambioTacosMaza: '',
        lubricacionLimpieza: '',
        // Frenos
        mantenimientoZapatas: '',
        recambioDelanteras: '',
        recambioTraseras: '',
        recambioCable: '',
        otros: '',
        // Disco
        mantenimientoDisco: '',
        recambioLiquido: ''
    });

    const [datosServicio, setDatosServicio] = useState(getEstadoInicial(clienteId));
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();

    // Reiniciar el estado cuando cambia el clienteId o se abre el modal
    useEffect(() => {
        if (isOpen && clienteId) {
            // Reiniciar el estado con valores vacíos
            setDatosServicio(getEstadoInicial(clienteId));
            // Luego cargar los datos si existen
            cargarDatosServicio();
        }
    }, [isOpen, clienteId]);

    const cargarDatosServicio = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiRender}/api/datosservicio/${clienteId}`);
            if (response.data) {
                // Cargar los datos existentes
                setDatosServicio({
                    ...getEstadoInicial(clienteId),
                    ...response.data,
                    clienteId: clienteId // Asegurar que siempre tenga el clienteId correcto
                });
            }
        } catch (error) {
            if (error.response?.status === 404) {
                // No hay datos previos, esto es normal para clientes nuevos
                console.log('No hay datos previos para cliente:', clienteId);
                // Ya tenemos el estado inicial vacío, no hacer nada
            } else {
                // Solo mostrar error si es algo diferente a 404
                console.error('Error al cargar datos del servicio:', error);
                toast({
                    title: 'Advertencia',
                    description: 'No se pudieron cargar los datos previos',
                    status: 'warning',
                    duration: 3000,
                    isClosable: true
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setDatosServicio(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            // Crear una copia sin el ID (el backend lo generará automáticamente)
            const { id, createdAt, updatedAt, ...dataToSend } = datosServicio;
            
            // Asegurar que el clienteId esté presente
            dataToSend.clienteId = clienteId;
            
            const response = await axios.post(`${apiRender}/api/datosservicio`, dataToSend);
            console.log('Respuesta del servidor:', response.data);
            
            toast({
                title: 'Éxito',
                description: 'Datos del servicio guardados correctamente',
                status: 'success',
                duration: 3000,
                isClosable: true
            });
            onClose();
        } catch (error) {
            console.error('=== ERROR AL GUARDAR ===');
            console.error('Error completo:', error);
            console.error('Response data:', error.response?.data);
            toast({
                title: 'Error',
                description: 'No se pudieron guardar los datos del servicio',
                status: 'error',
                duration: 3000,
                isClosable: true
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent w={["90%", "80%", "60%"]} borderRadius='10px' >
                <ModalHeader borderRadius='10px 10px 0px 0px' bg="red.500" color="white">
                    Datos del Servicio - {clienteNombre}
                </ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody py={6}>
                    {isLoading ? (
                        <Flex justify="center" align="center" minH="200px">
                            <Spinner size="xl" color="blue.500" />
                        </Flex>
                    ) : (
                        <Box>
                            {/* LUBRICADO Y FLUJO DE COMBUSTIBLE */}
                            <Heading size="md" mb={4} color="red.600">
                                LUBRICADO Y FLUJO DE COMBUSTIBLE
                            </Heading>
                            
                            <FormControl mb={3}>
                                <FormLabel>Cambio de Aceite de Motor</FormLabel>
                                <Select
                                    value={datosServicio.cambioAceiteMotor}
                                    onChange={(e) => handleChange('cambioAceiteMotor', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            {datosServicio.cambioAceiteMotor === 'SI' && (
                                <FormControl mb={3}>
                                    <FormLabel>Tipo de Aceite</FormLabel>
                                    <Input
                                        value={datosServicio.tipoAceite}
                                        onChange={(e) => handleChange('tipoAceite', e.target.value)}
                                        placeholder="Ej: 10W40"
                                    />
                                </FormControl>
                            )}

                            <FormControl mb={3}>
                                <FormLabel>Cambio de Filtro de Aceite</FormLabel>
                                <Select
                                    value={datosServicio.cambioFiltroAceite}
                                    onChange={(e) => handleChange('cambioFiltroAceite', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Cambio de Filtro de Aire</FormLabel>
                                <Select
                                    value={datosServicio.cambioFiltroAire}
                                    onChange={(e) => handleChange('cambioFiltroAire', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Cambio de Filtro de Combustible</FormLabel>
                                <Select
                                    value={datosServicio.cambioFiltroCombustible}
                                    onChange={(e) => handleChange('cambioFiltroCombustible', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Cambio de Mangueras</FormLabel>
                                <Select
                                    value={datosServicio.cambioMangueras}
                                    onChange={(e) => handleChange('cambioMangueras', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <Divider my={6} />

                            {/* SISTEMA ELÉCTRICO */}
                            <Heading size="md" mb={4} color="red.600">
                                SISTEMA ELÉCTRICO
                            </Heading>

                            <FormControl mb={3}>
                                <FormLabel>Diagnóstico de Batería</FormLabel>
                                <Select
                                    value={datosServicio.diagnosticoBateria}
                                    onChange={(e) => handleChange('diagnosticoBateria', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            {datosServicio.diagnosticoBateria === 'SI' && (
                                <FormControl mb={3}>
                                    <FormLabel>Voltaje de Batería</FormLabel>
                                    <Input
                                        value={datosServicio.voltajeBateria}
                                        onChange={(e) => handleChange('voltajeBateria', e.target.value)}
                                        placeholder="Ej: 12.6V"
                                    />
                                </FormControl>
                            )}

                            <FormControl mb={3}>
                                <FormLabel>Revisión de Regulador</FormLabel>
                                <Select
                                    value={datosServicio.revisionRegulador}
                                    onChange={(e) => handleChange('revisionRegulador', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Revisión de Sistema de Luces</FormLabel>
                                <Select
                                    value={datosServicio.revisionSistemaLuces}
                                    onChange={(e) => handleChange('revisionSistemaLuces', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            {datosServicio.revisionSistemaLuces === 'SI' && (
                                <FormControl mb={3}>
                                    <FormLabel>Focos en Mal Estado</FormLabel>
                                    <Input
                                        value={datosServicio.focosEnMalEstado}
                                        onChange={(e) => handleChange('focosEnMalEstado', e.target.value)}
                                        placeholder="Ej: Delantero izquierdo"
                                    />
                                </FormControl>
                            )}

                            <FormControl mb={3}>
                                <FormLabel>Fichas de Recambio</FormLabel>
                                <Input
                                    value={datosServicio.fichasRecambio}
                                    onChange={(e) => handleChange('fichasRecambio', e.target.value)}
                                    placeholder="NO / Detallar si hubo recambios"
                                />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Terminales de Recambio</FormLabel>
                                <Input
                                    value={datosServicio.terminalesRecambio}
                                    onChange={(e) => handleChange('terminalesRecambio', e.target.value)}
                                    placeholder="NO / Detallar si hubo recambios"
                                />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Revisión de Fugas</FormLabel>
                                <Select
                                    value={datosServicio.revisionFugas}
                                    onChange={(e) => handleChange('revisionFugas', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Reparación de Cables Dañados</FormLabel>
                                <Select
                                    value={datosServicio.reparacionCablesDanados}
                                    onChange={(e) => handleChange('reparacionCablesDanados', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <Divider my={6} />

                            {/* TRANSMISIÓN */}
                            <Heading size="md" mb={4} color="gray.700">
                                TRANSMISIÓN
                            </Heading>

                            <FormControl mb={3}>
                                <FormLabel>Cambio de Transmisión</FormLabel>
                                <Select
                                    value={datosServicio.cambioTransmision}
                                    onChange={(e) => handleChange('cambioTransmision', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Reducción de Cadena</FormLabel>
                                <Select
                                    value={datosServicio.reduccionCadena}
                                    onChange={(e) => handleChange('reduccionCadena', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Cambio de Tornillos de Corona</FormLabel>
                                <Select
                                    value={datosServicio.cambioTornillosCorona}
                                    onChange={(e) => handleChange('cambioTornillosCorona', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            {datosServicio.cambioTornillosCorona === 'SI' && (
                                <FormControl mb={3}>
                                    <FormLabel>Cantidad de Tornillos</FormLabel>
                                    <Input
                                        value={datosServicio.cantidadTornillos}
                                        onChange={(e) => handleChange('cantidadTornillos', e.target.value)}
                                        placeholder="Ej: 6"
                                    />
                                </FormControl>
                            )}

                            <FormControl mb={3}>
                                <FormLabel>Cambio de Tacos de Maza</FormLabel>
                                <Select
                                    value={datosServicio.cambioTacosMaza}
                                    onChange={(e) => handleChange('cambioTacosMaza', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Lubricación y Limpieza</FormLabel>
                                <Select
                                    value={datosServicio.lubricacionLimpieza}
                                    onChange={(e) => handleChange('lubricacionLimpieza', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <Divider my={6} />

                            {/* FRENOS */}
                            <Heading size="md" mb={4} color="red.600">
                                FRENOS
                            </Heading>

                            <FormControl mb={3}>
                                <FormLabel>Mantenimiento de Zapatas</FormLabel>
                                <Select
                                    value={datosServicio.mantenimientoZapatas}
                                    onChange={(e) => handleChange('mantenimientoZapatas', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Recambio Delanteras</FormLabel>
                                <Input
                                    value={datosServicio.recambioDelanteras}
                                    onChange={(e) => handleChange('recambioDelanteras', e.target.value)}
                                    placeholder="NO / Detallar recambios"
                                />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Recambio Traseras</FormLabel>
                                <Input
                                    value={datosServicio.recambioTraseras}
                                    onChange={(e) => handleChange('recambioTraseras', e.target.value)}
                                    placeholder="NO / Detallar recambios"
                                />
                            </FormControl>

                            <FormControl mb={3}>
                                <FormLabel>Recambio de Cable</FormLabel>
                                <Input
                                    value={datosServicio.recambioCable}
                                    onChange={(e) => handleChange('recambioCable', e.target.value)}
                                    placeholder="NO / Detallar recambios"
                                />
                            </FormControl>

                            <FormControl mb={4}>
                                <FormLabel>Otros</FormLabel>
                                <Input
                                    value={datosServicio.otros}
                                    onChange={(e) => handleChange('otros', e.target.value)}
                                    placeholder="Detallar otros trabajos"
                                />
                            </FormControl>

                            <Divider my={6} />

                            {/* MANTENIMIENTO DE DISCO */}
                            <Heading size="md" mb={4} color="gray.700">
                                MANTENIMIENTO DE DISCO
                            </Heading>

                            <FormControl mb={3}>
                                <FormLabel>Mantenimiento de Disco</FormLabel>
                                <Select
                                    value={datosServicio.mantenimientoDisco}
                                    onChange={(e) => handleChange('mantenimientoDisco', e.target.value)}
                                    placeholder="Seleccionar..."
                                >
                                    <option value="SI">SI</option>
                                    <option value="NO">NO</option>
                                </Select>
                            </FormControl>

                            {datosServicio.mantenimientoDisco === 'SI' && (
                                <FormControl mb={3}>
                                    <FormLabel>Recambio de Líquido</FormLabel>
                                    <Input
                                        value={datosServicio.recambioLiquido}
                                        onChange={(e) => handleChange('recambioLiquido', e.target.value)}
                                        placeholder="Detallar tipo de líquido"
                                    />
                                </FormControl>
                            )}
                        </Box>
                    )}
                </ModalBody>

                <ModalFooter>
                    <Button 
                        colorScheme="gray" 
                        mr={3} 
                        onClick={onClose}
                        isDisabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        colorScheme="blue" 
                        onClick={handleSubmit}
                        isLoading={isSaving}
                        loadingText="Guardando..."
                    >
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DatosServicioModal;