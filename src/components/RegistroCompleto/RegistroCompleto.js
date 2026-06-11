import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Box,
    Heading,
    useDisclosure,
    Text,
    Button,
    Flex,
    Image,
    useToast,
    Input,
    Select,
    Textarea,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Spinner,
    IconButton,
    Tooltip
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import logo from '../../img/motor.jpeg'
import ClienteModal from './ClienteModal';
import MontoModal from './MontoModal';
import DatosServicioModal from './DatosServicioModal';
import { Link } from 'react-router-dom';
import fondo from '../../img/fondo.jpeg'

const MotionBox = motion(Box);

/* ============================= ICONOS ============================= */

const IconEdit = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </svg>
);

const IconCheck = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

const IconClose = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const IconBike = (props) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" />
        <path d="M15 6h2.5l3 6.5M5.5 17.5 9 11h6l3.5 6.5M9 11 7 7H4" />
    </svg>
);

const IconWrench = (props) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
);

const IconUserCard = (props) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
);

const IconTrash = (props) => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

/* ====================== HELPERS DE FORMATO ====================== */

const formatMoney = (n) => `$${Number(n || 0).toLocaleString('es-AR')}`;

const formatDate = (dateString) => {
    if (!dateString) return 'Sin asignar';
    const [year, month, day] = dateString.slice(0, 10).split('-');
    return `${day}-${month}-${year}`;
};

const textoProximoServicio = (valor) => {
    if (valor === null || valor === undefined || `${valor}`.length === 0) return 'Sin programar';
    if (parseInt(valor, 10) === -1) return 'Realizar ahora';
    return `${valor} días`;
};

/* ====================== CAMPO EDITABLE INLINE ======================
   Un solo componente para todos los campos editables de la card.
   Muestra el valor con un botón de lápiz; al editar muestra el input
   con botones Guardar (check) y Cancelar (cruz). Sin recargar la página. */

const CampoEditable = ({ label, displayValue, rawValue, type = 'number', onSave, accent = '#9B3922', destacado = false }) => {
    const [editando, setEditando] = useState(false);
    const [draft, setDraft] = useState('');
    const [guardando, setGuardando] = useState(false);

    const empezar = () => {
        setDraft(rawValue ?? '');
        setEditando(true);
    };

    const guardar = async () => {
        setGuardando(true);
        const ok = await onSave(draft);
        setGuardando(false);
        if (ok) setEditando(false);
    };

    const InputComp = type === 'textarea' ? Textarea : Input;

    return (
        <Box
            bg={destacado ? 'rgba(72, 30, 20, 0.04)' : 'white'}
            border="1px solid"
            borderColor={editando ? accent : 'gray.100'}
            borderRadius="12px"
            px="14px"
            py="10px"
            transition="border-color 0.2s ease, box-shadow 0.2s ease"
            boxShadow={editando ? `0 0 0 3px ${accent}22` : 'none'}
        >
            <Text
                fontSize="0.66rem"
                fontWeight="700"
                letterSpacing="0.08em"
                textTransform="uppercase"
                color="gray.500"
                mb="2px"
            >
                {label}
            </Text>
            {editando ? (
                <MotionBox
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15 }}
                    display="flex"
                    flexDir={type === 'textarea' ? 'column' : 'row'}
                    gap="8px"
                    alignItems={type === 'textarea' ? 'stretch' : 'center'}
                >
                    <InputComp
                        size="sm"
                        type={type === 'textarea' ? undefined : type}
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        autoFocus
                        borderRadius="8px"
                        bg="white"
                        rows={type === 'textarea' ? 2 : undefined}
                        onKeyDown={(e) => { if (e.key === 'Enter' && type !== 'textarea') guardar(); if (e.key === 'Escape') setEditando(false); }}
                    />
                    <Flex gap="6px" justify={type === 'textarea' ? 'flex-end' : 'flex-start'}>
                        <Tooltip label="Guardar" hasArrow fontSize="xs">
                            <IconButton
                                aria-label="Guardar"
                                icon={guardando ? <Spinner size="xs" /> : <IconCheck />}
                                size="sm"
                                minW="34px"
                                h="30px"
                                borderRadius="full"
                                bg="green.500"
                                color="white"
                                _hover={{ bg: 'green.600', transform: 'scale(1.06)' }}
                                _active={{ transform: 'scale(0.95)' }}
                                onClick={guardar}
                                isDisabled={guardando}
                            />
                        </Tooltip>
                        <Tooltip label="Cancelar" hasArrow fontSize="xs">
                            <IconButton
                                aria-label="Cancelar"
                                icon={<IconClose />}
                                size="sm"
                                minW="34px"
                                h="30px"
                                borderRadius="full"
                                bg="gray.100"
                                color="gray.600"
                                _hover={{ bg: 'gray.200', transform: 'scale(1.06)' }}
                                _active={{ transform: 'scale(0.95)' }}
                                onClick={() => setEditando(false)}
                                isDisabled={guardando}
                            />
                        </Tooltip>
                    </Flex>
                </MotionBox>
            ) : (
                <Flex align="center" justify="space-between" gap="8px">
                    <Text
                        fontSize={destacado ? '1.05rem' : '0.92rem'}
                        fontWeight={destacado ? '700' : '600'}
                        color="#1d1d1f"
                        noOfLines={type === 'textarea' ? 3 : 1}
                    >
                        {displayValue}
                    </Text>
                    {onSave && (
                        <Tooltip label={`Editar ${label.toLowerCase()}`} hasArrow fontSize="xs">
                            <IconButton
                                aria-label={`Editar ${label}`}
                                icon={<IconEdit />}
                                size="xs"
                                minW="28px"
                                h="28px"
                                borderRadius="full"
                                variant="ghost"
                                color="#9B3922"
                                _hover={{ bg: '#9B392215', transform: 'scale(1.1)' }}
                                _active={{ transform: 'scale(0.95)' }}
                                onClick={empezar}
                            />
                        </Tooltip>
                    )}
                </Flex>
            )}
        </Box>
    );
};

/* ===================== CAMPO ESTÁTICO (solo lectura) ===================== */

const CampoEstatico = ({ label, children }) => (
    <Box
        bg="white"
        border="1px solid"
        borderColor="gray.100"
        borderRadius="12px"
        px="14px"
        py="10px"
    >
        <Text fontSize="0.66rem" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="gray.500" mb="2px">
            {label}
        </Text>
        <Text fontSize="0.92rem" fontWeight="600" color="#1d1d1f">
            {children}
        </Text>
    </Box>
);

/* ============================= CARD ============================= */

const RegistroCard = ({ registro, index, onPatchServicio, onVerCliente, onVerFicha, onEliminar, apiRender, toast }) => {
    const servicio = registro.Servicios[0];
    const moto = registro.Motos[0];
    const conDeuda = Number(servicio.deuda) > 0;
    const accent = conDeuda ? '#E53E3E' : '#38A169';
    const inicial = (registro.nombre || '?').trim().charAt(0).toUpperCase();

    // Guarda un campo en el backend y actualiza el estado local (sin recargar)
    const guardarCampo = useCallback(async (url, body, mensaje) => {
        try {
            const { data } = await axios.put(`${apiRender}${url}`, body);
            onPatchServicio(registro.id, data);
            toast({ title: 'Guardado', description: mensaje, status: 'success', duration: 2500, isClosable: true, position: 'bottom-right' });
            return true;
        } catch (error) {
            console.error('Error al guardar', error);
            toast({ title: 'Error', description: 'No se pudo guardar el cambio', status: 'error', duration: 4000, isClosable: true, position: 'bottom-right' });
            return false;
        }
    }, [apiRender, registro.id, onPatchServicio, toast]);

    return (
        <AccordionItem border="none" mb="18px">
            {({ isExpanded }) => (
                <MotionBox
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.35) }}
                    position="relative"
                    bg="white"
                    borderRadius="14px"
                    overflow="hidden"
                    boxShadow={isExpanded
                        ? '0 16px 40px rgba(0, 0, 0, 0.35)'
                        : '0 3px 10px rgba(0, 0, 0, 0.22)'}
                    transform={isExpanded ? 'translateY(-3px)' : 'none'}
                    _hover={{ boxShadow: '0 12px 30px rgba(0, 0, 0, 0.32)', transform: 'translateY(-3px)' }}
                    sx={{ transition: 'box-shadow 0.25s ease, transform 0.25s ease' }}
                >
                    {/* Barra lateral de estado: verde al día, roja con deuda */}
                    <Box position="absolute" left="0" top="0" bottom="0" w="5px" bg={accent} />

                    <AccordionButton p="0" _hover={{ bg: 'transparent' }} _focusVisible={{ boxShadow: 'none' }}>
                        <Flex
                            w="100%"
                            align="center"
                            gap={['12px', '16px', '16px']}
                            pl={['16px', '22px', '22px']}
                            pr={['12px', '18px', '18px']}
                            py={['14px', '16px', '16px']}
                        >
                            {/* Avatar con inicial */}
                            <Flex
                                align="center"
                                justify="center"
                                minW={['42px', '48px', '48px']}
                                h={['42px', '48px', '48px']}
                                borderRadius="full"
                                bg="#481E14"
                                color="#FDA633"
                                fontWeight="700"
                                fontSize={['1.1rem', '1.25rem', '1.25rem']}
                            >
                                {inicial}
                            </Flex>

                            {/* Identidad */}
                            <Box flex="1" textAlign="start" minW="0">
                                <Flex align="baseline" gap="8px" wrap="wrap">
                                    <Text
                                        fontWeight="700"
                                        fontSize={['1rem', '1.12rem', '1.12rem']}
                                        color="#1d1d1f"
                                        textTransform="capitalize"
                                        noOfLines={1}
                                    >
                                        {registro.nombre}
                                    </Text>
                                    <Text fontSize="0.7rem" fontWeight="700" color="gray.400" letterSpacing="0.06em">
                                        #{String(index + 1).padStart(3, '0')}
                                    </Text>
                                </Flex>
                                <Flex align="center" gap="6px" mt="2px" color="gray.600">
                                    <IconBike />
                                    <Text fontSize="0.85rem" fontWeight="600" textTransform="capitalize" noOfLines={1}>
                                        {moto.marca} {moto.modelo}
                                    </Text>
                                </Flex>
                                {/* Chips de estado */}
                                <Flex gap="6px" mt="8px" wrap="wrap">
                                    <Box
                                        bg={conDeuda ? 'red.50' : 'green.50'}
                                        color={conDeuda ? 'red.600' : 'green.600'}
                                        border="1px solid"
                                        borderColor={conDeuda ? 'red.200' : 'green.200'}
                                        borderRadius="full"
                                        px="10px"
                                        py="2px"
                                        fontSize="0.7rem"
                                        fontWeight="700"
                                        letterSpacing="0.03em"
                                    >
                                        {conDeuda ? `DEUDA ${formatMoney(servicio.deuda)}` : 'AL DÍA'}
                                    </Box>
                                    <Box
                                        bg={parseInt(servicio.proximoServicio, 10) === -1 ? '#9B392212' : 'orange.50'}
                                        color={parseInt(servicio.proximoServicio, 10) === -1 ? '#9B3922' : 'orange.600'}
                                        border="1px solid"
                                        borderColor={parseInt(servicio.proximoServicio, 10) === -1 ? '#9B392240' : 'orange.200'}
                                        borderRadius="full"
                                        px="10px"
                                        py="2px"
                                        fontSize="0.7rem"
                                        fontWeight="700"
                                        letterSpacing="0.03em"
                                    >
                                        PRÓX. SERVICIO: {textoProximoServicio(servicio.proximoServicio).toUpperCase()}
                                    </Box>
                                </Flex>
                            </Box>

                            <AccordionIcon color="gray.400" boxSize="22px" />
                        </Flex>
                    </AccordionButton>

                    <AccordionPanel pl={['16px', '22px', '22px']} pr={['16px', '18px', '18px']} pb="18px" pt="2px">
                        {/* Motivo de ingreso */}
                        <Box
                            bg="rgba(72, 30, 20, 0.035)"
                            borderRadius="12px"
                            px="14px"
                            py="10px"
                            mb="12px"
                        >
                            <Text fontSize="0.66rem" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase" color="gray.500" mb="2px">
                                Motivo de ingreso
                            </Text>
                            <Text fontSize="0.92rem" fontWeight="500" color="#1d1d1f">
                                {servicio.descripcion || '-'}
                            </Text>
                            <Text fontSize="0.78rem" color="gray.500" mt="4px">
                                {moto.km ? `${moto.km} km` : 'Kilometraje sin registrar'}
                            </Text>
                        </Box>

                        {/* MONTOS */}
                        <Text fontSize="0.7rem" fontWeight="700" letterSpacing="0.12em" color="#9B3922" mb="8px" mt="14px">
                            MONTOS
                        </Text>
                        <Box display="grid" gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr']} gap="10px">
                            <CampoEditable
                                label="Mano de obra"
                                displayValue={formatMoney(servicio.montoManoObra)}
                                rawValue={servicio.montoManoObra}
                                onSave={(v) => guardarCampo(`/api/updatemontomanoobra/${registro.id}`, { montoManoObra: v }, 'Monto de mano de obra actualizado')}
                            />
                            <CampoEditable
                                label="Repuestos"
                                displayValue={formatMoney(servicio.montoRepuesto)}
                                rawValue={servicio.montoRepuesto}
                                onSave={(v) => guardarCampo(`/api/updatemontorepuesto/${registro.id}`, { montoRepuesto: v }, 'Monto de repuestos actualizado')}
                            />
                            <CampoEditable
                                label="Pago realizado"
                                displayValue={formatMoney(servicio.pago)}
                                rawValue={servicio.pago}
                                onSave={(v) => guardarCampo(`/api/updateservicio/${registro.id}`, { pago: v }, 'Pago actualizado')}
                            />
                            <CampoEstatico label="Monto total">
                                <Text as="span" fontSize="1.05rem" fontWeight="700">{formatMoney(servicio.monto)}</Text>
                            </CampoEstatico>
                        </Box>

                        {/* PRÓXIMO SERVICIO */}
                        <Text fontSize="0.7rem" fontWeight="700" letterSpacing="0.12em" color="#9B3922" mb="8px" mt="16px">
                            PRÓXIMO SERVICIO
                        </Text>
                        <Box display="grid" gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr']} gap="10px">
                            <CampoEditable
                                label="Días restantes"
                                displayValue={textoProximoServicio(servicio.proximoServicio)}
                                rawValue={servicio.proximoServicio}
                                onSave={(v) => guardarCampo(`/api/updateproximoservicio/${registro.id}`, { proximoServicio: v }, 'Próximo servicio actualizado')}
                            />
                            <CampoEditable
                                label="Kilometraje objetivo"
                                displayValue={servicio.kmProximoServicio ? `${servicio.kmProximoServicio} km` : 'Sin datos'}
                                rawValue={servicio.kmProximoServicio}
                                onSave={(v) => guardarCampo(`/api/updateproximoservicio/${registro.id}`, { kmProximoServicio: v }, 'Kilometraje actualizado')}
                            />
                        </Box>
                        <Box mt="10px">
                            <CampoEditable
                                label="Observaciones"
                                displayValue={servicio.descripcionProximoServicio || 'Sin observaciones'}
                                rawValue={servicio.descripcionProximoServicio}
                                type="textarea"
                                onSave={(v) => guardarCampo(`/api/updateproximoservicio/${registro.id}`, { descripcionProximoServicio: v }, 'Observaciones actualizadas')}
                            />
                        </Box>

                        {/* FECHAS */}
                        <Text fontSize="0.7rem" fontWeight="700" letterSpacing="0.12em" color="#9B3922" mb="8px" mt="16px">
                            FECHAS
                        </Text>
                        <Box display="grid" gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr']} gap="10px">
                            <CampoEstatico label="Ingreso al taller">
                                {servicio.fechaIngreso ? formatDate(servicio.fechaIngreso) : '-'}
                            </CampoEstatico>
                            <CampoEditable
                                label="Entrega"
                                displayValue={formatDate(servicio.fechaEntrega)}
                                rawValue={servicio.fechaEntrega ? servicio.fechaEntrega.slice(0, 10) : ''}
                                type="date"
                                onSave={(v) => guardarCampo(`/api/updatefechaentrega/${registro.id}`, { fechaEntrega: v || null }, 'Fecha de entrega actualizada')}
                            />
                        </Box>

                        {/* ACCIONES */}
                        <Flex
                            mt="18px"
                            pt="14px"
                            borderTop="1px solid"
                            borderColor="gray.100"
                            gap="10px"
                            flexDir={['column', 'row', 'row']}
                            justify="center"
                        >
                            <Button
                                size="sm"
                                h="38px"
                                px="18px"
                                borderRadius="full"
                                variant="outline"
                                borderColor="#481E14"
                                color="#481E14"
                                leftIcon={<IconUserCard />}
                                _hover={{ bg: '#481E14', color: 'white', transform: 'translateY(-1px)' }}
                                _active={{ transform: 'translateY(0)' }}
                                onClick={() => onVerCliente(registro)}
                            >
                                Datos personales
                            </Button>
                            <Button
                                size="sm"
                                h="38px"
                                px="18px"
                                borderRadius="full"
                                bg="#481E14"
                                color="#FDA633"
                                leftIcon={<IconWrench />}
                                boxShadow="0 4px 12px rgba(72, 30, 20, 0.3)"
                                _hover={{ bg: '#5a2619', transform: 'translateY(-1px)', boxShadow: '0 6px 16px rgba(72, 30, 20, 0.4)' }}
                                _active={{ transform: 'translateY(0)' }}
                                onClick={() => onVerFicha(registro)}
                            >
                                Ficha técnica
                            </Button>
                            <Button
                                size="sm"
                                h="38px"
                                px="18px"
                                borderRadius="full"
                                variant="outline"
                                borderColor="red.300"
                                color="red.500"
                                leftIcon={<IconTrash />}
                                _hover={{ bg: 'red.500', borderColor: 'red.500', color: 'white', transform: 'translateY(-1px)' }}
                                _active={{ transform: 'translateY(0)' }}
                                onClick={() => onEliminar(registro.id)}
                            >
                                Eliminar
                            </Button>
                        </Flex>
                    </AccordionPanel>
                </MotionBox>
            )}
        </AccordionItem>
    );
};

/* ============================= PÁGINA ============================= */

const CACHE_KEY = 'tallertobias-registros';

const RegistroCompleto = ({ apiRender }) => {
    const [registros, setRegistros] = useState(() => {
        // Carga instantánea: muestra lo último conocido mientras refresca en segundo plano
        try {
            const cache = sessionStorage.getItem(CACHE_KEY);
            return cache ? JSON.parse(cache) : [];
        } catch { return []; }
    });
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState('')
    const [filtroProximoServicio, setFiltroProximoServicio] = useState('');
    const [filtroDeuda, setFiltroDeuda] = useState('');
    const [ordenFecha, setOrdenFecha] = useState('');
    const [mesSeleccionado, setMesSeleccionado] = useState('')
    const [añoSeleccionado, setAñoSeleccionado] = useState('')
    const [isLoading, setIsLoading] = useState(registros.length === 0)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDatosServicioModalOpen, setIsDatosServicioModalOpen] = useState(false);
    const [clienteSeleccionadoServicio, setClienteSeleccionadoServicio] = useState(null);

    const toast = useToast()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${apiRender}/registrocompleto`);
                setRegistros(response.data);
                try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(response.data)); } catch { /* sin espacio: ignorar */ }
                setIsLoading(false)
            } catch (error) {
                console.error('Error al obtener registros:', error);
                setIsLoading(false)
                toast({ title: 'Error', description: 'No se pudieron cargar los registros', status: 'error', duration: 5000, isClosable: true });
            }
        };
        fetchData();
    }, [apiRender, toast]);

    // Actualiza un servicio dentro del estado local (sin recargar la página)
    const patchServicio = useCallback((clienteId, servicioActualizado) => {
        setRegistros(prev => {
            const next = prev.map(r =>
                r.id === clienteId
                    ? { ...r, Servicios: [{ ...r.Servicios[0], ...servicioActualizado }] }
                    : r
            );
            try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch { /* ignorar */ }
            return next;
        });
    }, []);

    // Ver Modal con los datos del cliente
    const handleClienteClick = useCallback((cliente) => {
        setClienteSeleccionado(cliente);
        onOpen();
    }, [onOpen]);

    // Ficha técnica
    const handleDatosServicioClick = useCallback((cliente) => {
        setClienteSeleccionadoServicio(cliente);
        setIsDatosServicioModalOpen(true);
    }, []);

    // Eliminar cliente
    const handleEliminarCliente = useCallback(async (id) => {
        if (window.confirm('¿Estás seguro que quieres eliminar a este cliente?')) {
            try {
                await axios.delete(`${apiRender}/registrocompleto/${id}`);
                setRegistros(prev => {
                    const next = prev.filter(registro => registro.id !== id);
                    try { sessionStorage.setItem(CACHE_KEY, JSON.stringify(next)); } catch { /* ignorar */ }
                    return next;
                });
                toast({ title: 'Cliente eliminado', description: 'El cliente fue eliminado con éxito', status: 'success', duration: 4000, isClosable: true, position: 'bottom-right' })
            } catch (error) {
                toast({ title: 'Error', description: 'No se pudo eliminar al cliente', status: 'error', duration: 5000, isClosable: true, position: 'bottom-right' })
                console.error('Error al eliminar el cliente', error)
            }
        }
    }, [apiRender, toast]);

    // Filtrado y ordenamiento (memoizado: no recalcula en cada render)
    const registrosFiltrados = useMemo(() => registros
        .filter((registro) => registro.Servicios?.length && registro.Motos?.length)
        .filter((registro) => registro.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        .filter((registro) => {
            if (!mesSeleccionado && !añoSeleccionado) return true;
            const base = registro.Servicios[0].fechaEntrega || registro.Servicios[0].fechaIngreso || registro.Servicios[0].createdAt;
            if (!base) return false;
            const fecha = new Date(base);
            const mes = fecha.getMonth() + 1;
            const año = fecha.getFullYear();
            return (
                (!mesSeleccionado || mes === parseInt(mesSeleccionado, 10)) &&
                (!añoSeleccionado || año === parseInt(añoSeleccionado, 10))
            );
        })
        .filter((registro) => {
            if (filtroProximoServicio === 'todos' || filtroProximoServicio === '') return true;
            const valor = registro.Servicios[0].proximoServicio;
            const proximoServicio = parseInt(valor, 10);
            if (filtroProximoServicio === 'realizar') return proximoServicio === -1;
            if (filtroProximoServicio === 'pendiente') return proximoServicio > 0;
            if (filtroProximoServicio === 'sin-proximo') return !valor || `${valor}` === '';
            return true;
        })
        .filter((registro) => {
            if (filtroDeuda === 'todos' || filtroDeuda === '') return true;
            if (filtroDeuda === 'con-deuda') return registro.Servicios[0].deuda > 0;
            if (filtroDeuda === 'sin-deuda') return registro.Servicios[0].deuda <= 0;
            return true;
        })
        .sort((a, b) => {
            if (filtroProximoServicio === 'pendiente') {
                return parseInt(a.Servicios[0].proximoServicio, 10) - parseInt(b.Servicios[0].proximoServicio, 10);
            }
            if (filtroDeuda === 'con-deuda') {
                return b.Servicios[0].deuda - a.Servicios[0].deuda;
            }
            const fechaA = new Date(a.Servicios[0].fechaEntrega || a.Servicios[0].fechaIngreso || a.Servicios[0].createdAt || 0);
            const fechaB = new Date(b.Servicios[0].fechaEntrega || b.Servicios[0].fechaIngreso || b.Servicios[0].createdAt || 0);
            return (ordenFecha === 'antiguos') ? fechaA - fechaB : fechaB - fechaA;
        }), [registros, busqueda, mesSeleccionado, añoSeleccionado, filtroProximoServicio, filtroDeuda, ordenFecha]);

    return (
        <Box maxW="100%" mx="auto" h='auto' minHeight='100vh' p="4" backgroundImage={fondo} backgroundColor='rgba(0, 0, 0, 0.75)' backgroundBlendMode='overlay' backgroundAttachment='fixed' backgroundSize='cover'>
            <Flex
                flexDir={['column', 'row', 'row']}
                rowGap='20px'
                justifyContent='space-between'
                alignItems='center'
            >
                <Image bgColor='black' borderRadius='100px' src={logo} alt='logo del taller' w='90px' h='90px' padding='4px' />
                <Flex
                    flexDir={['column', 'row', 'row']}
                    rowGap='20px'
                    columnGap='15px'
                    justifyContent='flex-end'
                    alignItems='center'
                    wrap='wrap'
                    mb='30px'
                >
                    <Link to='/'>
                        <Button
                            bg='primario.1'
                            color='secundario.2'
                            borderRadius='full'
                            px='24px'
                            boxShadow="0 6px 16px rgba(0, 0, 0, 0.3)"
                            transition="all 0.2s ease"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(0, 0, 0, 0.4)' }}
                            _active={{ transform: 'translateY(0)' }}
                        >
                            Home
                        </Button>
                    </Link>
                    <Link to='/cliente'>
                        <Button
                            bg='primario.1'
                            color='secundario.2'
                            borderRadius='full'
                            px='24px'
                            boxShadow="0 6px 16px rgba(0, 0, 0, 0.3)"
                            transition="all 0.2s ease"
                            _hover={{ transform: 'translateY(-2px)', boxShadow: '0 10px 22px rgba(0, 0, 0, 0.4)' }}
                            _active={{ transform: 'translateY(0)' }}
                        >
                            Nuevo Registro
                        </Button>
                    </Link>
                </Flex>
            </Flex>
            <Heading mb="6" textAlign="center" color='white' fontSize={['2rem', '3rem', '3rem']}>Registro Completo de Servicios</Heading>
            <Flex justifyContent='center'>
                <Input
                    textAlign='center'
                    mb='15px'
                    w={['90%', '60%', '40%']}
                    placeholder='Buscar cliente por nombre'
                    bg='white'
                    borderRadius='full'
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </Flex>
            <Box
                display='flex'
                justifyContent='center'
                columnGap='15px'
                rowGap='4px'
                flexWrap='wrap'
            >
                <Select
                    placeholder="Seleccionar mes"
                    onChange={(e) => setMesSeleccionado(e.target.value)}
                    value={mesSeleccionado}
                    w={['45%', '200px', '200px']}
                    textAlign='center'
                    mb={4}
                    bg='white'
                    borderRadius='full'
                >
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                </Select>
                <Select
                    placeholder="Seleccionar año"
                    onChange={(e) => setAñoSeleccionado(e.target.value)}
                    value={añoSeleccionado}
                    w={['45%', '200px', '200px']}
                    textAlign="center"
                    mb={4}
                    bg="white"
                    borderRadius='full'
                >
                    {Array.from({ length: 3 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        );
                    })}
                </Select>
                <Select
                    placeholder="Estado del servicio"
                    value={filtroProximoServicio}
                    onChange={(e) => setFiltroProximoServicio(e.target.value)}
                    w={['45%', '200px', '200px']}
                    mb={4}
                    bg="white"
                    borderRadius='full'
                >
                    <option value="todos">Todos</option>
                    <option value="realizar">Realizar Próximo Servicio</option>
                    <option value="pendiente">Servicio Pendiente</option>
                    <option value="sin-proximo">Sin próximo servicio</option>
                </Select>
                <Select
                    placeholder="Estado de deuda"
                    value={filtroDeuda}
                    onChange={(e) => setFiltroDeuda(e.target.value)}
                    w={['45%', '200px', '200px']}
                    mb={4}
                    bg="white"
                    borderRadius='full'
                >
                    <option value="todos">Todos</option>
                    <option value="con-deuda">Con deuda</option>
                    <option value="sin-deuda">Sin deuda</option>
                </Select>
                <Select
                    placeholder="Ordenar por fecha"
                    value={ordenFecha}
                    onChange={(e) => setOrdenFecha(e.target.value)}
                    w={['45%', '200px', '200px']}
                    mb={4}
                    bg="white"
                    borderRadius='full'
                >
                    <option value="recientes">Más recientes</option>
                    <option value="antiguos">Más antiguos</option>
                </Select>
                <Flex gap='15px' direction={['column', 'row', 'row']} align='center'>
                    <MontoModal registrosFiltrados={registrosFiltrados} />
                    <Button
                        colorScheme="red"
                        borderRadius='full'
                        onClick={() => {
                            setBusqueda('');
                            setMesSeleccionado('');
                            setAñoSeleccionado('');
                            setFiltroProximoServicio('todos');
                            setFiltroDeuda('todos');
                            setOrdenFecha('recientes');
                        }}
                    >
                        Limpiar Filtros
                    </Button>
                </Flex>
            </Box>
            <Flex
                w='100%'
                alignItems='center'
                justifyContent='center'
                mt='24px'
            >
                {isLoading ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        mt='20px'
                        gap='12px'
                    >
                        <Spinner size="xl" color="primario.1" thickness='3px' />
                        <Text color='white' fontWeight='600'>Cargando registros...</Text>
                        <Text color='whiteAlpha.700' fontSize='0.8rem'>Si el servidor estaba en reposo puede demorar unos segundos</Text>
                    </Box>
                ) : (
                    <Box w={['100%', '90%', '760px']} maxW='100%'>
                        {registrosFiltrados.length === 0 ? (
                            <Text color='white' textAlign='center' mt='30px' fontWeight='600'>
                                No se encontraron registros con los filtros aplicados
                            </Text>
                        ) : (
                            <Accordion allowToggle>
                                {registrosFiltrados.map((registro, index) => (
                                    <RegistroCard
                                        key={registro.id}
                                        registro={registro}
                                        index={index}
                                        onPatchServicio={patchServicio}
                                        onVerCliente={handleClienteClick}
                                        onVerFicha={handleDatosServicioClick}
                                        onEliminar={handleEliminarCliente}
                                        apiRender={apiRender}
                                        toast={toast}
                                    />
                                ))}
                            </Accordion>
                        )}
                    </Box>
                )}
            </Flex>
            {clienteSeleccionado && (
                <ClienteModal isOpen={isOpen} onClose={onClose} clienteSeleccionado={clienteSeleccionado} />
            )}
            {clienteSeleccionadoServicio && (
                <DatosServicioModal
                    isOpen={isDatosServicioModalOpen}
                    onClose={() => setIsDatosServicioModalOpen(false)}
                    clienteId={clienteSeleccionadoServicio.id}
                    clienteNombre={clienteSeleccionadoServicio.nombre}
                    apiRender={apiRender}
                />
            )}
        </Box>
    );
};

export default RegistroCompleto;
