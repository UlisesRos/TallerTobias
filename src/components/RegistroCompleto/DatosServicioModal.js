import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
    ModalBody, ModalCloseButton, Button, ButtonGroup, useToast,
    Box, Flex, Text, Input, Spinner,
    Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon,
} from '@chakra-ui/react';

const SiNo = ({ field, value, onChange }) => (
    <ButtonGroup size="xs" isAttached>
        <Button
            bg={value === 'SI' ? 'red.500' : 'gray.100'}
            color={value === 'SI' ? 'white' : 'gray.600'}
            _hover={{ opacity: 0.85 }}
            onClick={() => onChange(field, value === 'SI' ? '' : 'SI')}
        >SI</Button>
        <Button
            bg={value === 'NO' ? 'gray.600' : 'gray.100'}
            color={value === 'NO' ? 'white' : 'gray.600'}
            _hover={{ opacity: 0.85 }}
            onClick={() => onChange(field, value === 'NO' ? '' : 'NO')}
        >NO</Button>
    </ButtonGroup>
);

const BuenoMalo = ({ field, value, onChange }) => (
    <ButtonGroup size="xs" isAttached>
        <Button
            bg={value === 'BUENO' ? 'green.500' : 'gray.100'}
            color={value === 'BUENO' ? 'white' : 'gray.600'}
            _hover={{ opacity: 0.85 }}
            onClick={() => onChange(field, value === 'BUENO' ? '' : 'BUENO')}
        >BUENO</Button>
        <Button
            bg={value === 'MALO' ? 'red.500' : 'gray.100'}
            color={value === 'MALO' ? 'white' : 'gray.600'}
            _hover={{ opacity: 0.85 }}
            onClick={() => onChange(field, value === 'MALO' ? '' : 'MALO')}
        >MALO</Button>
    </ButtonGroup>
);

const Row = ({ label, children }) => (
    <Flex mb={2} align="center" justify="space-between" gap={2}>
        <Text fontSize="sm" flex={1}>{label}</Text>
        {children}
    </Flex>
);

const Sub = ({ label, children }) => (
    <Flex mb={2} align="center" justify="space-between" gap={2} pl={3} borderLeft="2px solid" borderColor="red.200">
        <Text fontSize="sm" color="gray.600" flex={1}>{label}</Text>
        {children}
    </Flex>
);

const TxtInput = ({ field, value, onChange, placeholder = '' }) => (
    <Input
        size="xs"
        value={value}
        onChange={e => onChange(field, e.target.value)}
        placeholder={placeholder}
        maxW="180px"
        flex={1}
    />
);

const SubGroup = ({ children }) => (
    <Box pl={3} borderLeft="2px solid" borderColor="red.200" mb={1}>
        {children}
    </Box>
);

const getEstadoInicial = (id) => ({
    clienteId: id,
    cambioAceite: '', tipoAceite: '', cambioFiltroAceite: '', marcaFiltroAceite: '',
    cambioMangueras: '', cambioFiltroNafta: '', cambioBombaNafta: '', cambioFiltroAire: '',
    limpiezaMantenimiento: '', cambioReparacion: '', cambioCarburador: '',
    revisionAsientoValvulas: '', reparacionRecambioValvulas: '', registroValvulas: '', luzValvulas: '',
    cambioBujia: '', tipoBujia: '', juntaEscape: '',
    revisionCompresion: '', psiCompresion: '',
    rectificacionCilindro: '', medidaCilindro: '', marcaCilindro: '',
    cambioDisco: '', marcaDiscos: '',
    recambioCanasta: '',
    revisionCentrifugo: '', recambioCentrifugoSimple: '', recambioEmbragueCentrifugo: '',
    cambioJuntaTapaEmbrague: '',
    revisionBombaAceite: '', recambioBombaAceite: '',
    pruebaBateria: '', medicionBateria: '',
    pruebaSistemaCarga: '', cambioRegulador: '', cambioBateria: '', cambioEstator: '',
    encendidoElectrico: '', cambioBoton: '', cambioRelaySolenoide: '', cambioBendix: '',
    reparacionBendix: '', reparacionArrastreBurro: '',
    reparacionProblemaElectrico: '', cualProblemaElectrico: '',
    pruebaDeLuces: '', recambioFocos: '',
    pruebaBotones: '', recambioBotones: '',
    pruebaBocina: '',
    frenoDelantero: '',
    recambioPastillasDelantera: '', recambioZapatasDelantera: '',
    liquidoFrenoDelantero: '', bombaFrenoDelantera: '',
    calisperFrenoDelantero: '', cableFrenoDelantero: '', otrosFrenoDelantero: '',
    frenoTrasero: '',
    recambioPastillasTrasera: '', recambioZapatasTrasera: '',
    liquidoFrenoTrasero: '', bombaFrenoTrasera: '',
    calisperFrenoTrasero: '', varrillaFrenoTrasero: '', otrosFrenoTrasero: '',
    recambioTransmisionCompleta: '', tipoTransmision: '',
    registroLavadoLubricado: '', cambioTacosBujesMasa: '',
    cambioEjeTrasero: '', cambioPortaCorona: '',
    cambioTornillosSeguros: '',
    cambioRulemanes: '', cualesRulemanes: '',
    cambioRetenes: '', cualesRetenes: '',
    cambioOring: '', cualesOring: '',
    mantenimientoBarrasVastagos: '', cambioLiquidoHidraulico: '',
    cambioResortes: '',
    cambioRetenesSuspension: '', medidasRetenesSuspension: '',
    cambioBolillerosDireccionales: '',
    mantenimientoTraserAmortiguacion: '',
    cambioBujesHorquillon: '', medidaBujesHorquillon: '',
    cambioEjeHorquillon: '',
    cambioBujesMonoshock: '', cambioMonoshock: '', cambioAmortiguadores: '',
    problemaElectricoTablero: '', cualProblemaTablero: '',
    velocimetro: '', cambioRetorno: '', cambioCableTablero: '',
    otrosTrabajos: '',
});

// Mapea campos del modelo viejo a los nuevos para clientes existentes
const mapOldToNew = (data) => {
    const m = {};
    if (data.cambioAceiteMotor)       m.cambioAceite = data.cambioAceiteMotor;
    if (data.diagnosticoBateria)      m.pruebaBateria = data.diagnosticoBateria;
    if (data.voltajeBateria)          m.medicionBateria = data.voltajeBateria;
    if (data.revisionRegulador)       m.cambioRegulador = data.revisionRegulador;
    if (data.revisionSistemaLuces)    m.pruebaDeLuces = data.revisionSistemaLuces;
    if (data.focosEnMalEstado)        m.recambioFocos = data.focosEnMalEstado;
    if (data.reparacionCablesDanados) m.reparacionProblemaElectrico = data.reparacionCablesDanados;
    if (data.cambioTransmision)       m.recambioTransmisionCompleta = data.cambioTransmision;
    if (data.reduccionCadena)         m.registroLavadoLubricado = data.reduccionCadena;
    if (data.cambioTornillosCorona)   m.cambioTornillosSeguros = data.cambioTornillosCorona;
    if (data.cambioTacosMaza)         m.cambioTacosBujesMasa = data.cambioTacosMaza;
    if (data.lubricacionLimpieza)     m.limpiezaMantenimiento = data.lubricacionLimpieza;
    if (data.recambioDelanteras && data.recambioDelanteras !== 'NO') {
        m.frenoDelantero = 'SI';
        m.otrosFrenoDelantero = data.recambioDelanteras;
    }
    if (data.recambioTraseras && data.recambioTraseras !== 'NO') {
        m.frenoTrasero = 'SI';
        m.otrosFrenoTrasero = data.recambioTraseras;
    }
    if (data.recambioCable)  m.cableFrenoDelantero = data.recambioCable;
    if (data.otros)          m.otrosTrabajos = data.otros;
    if (data.recambioLiquido) m.cambioLiquidoHidraulico = data.recambioLiquido;
    return m;
};

const DatosServicioModal = ({ isOpen, onClose, clienteId, clienteNombre, apiRender }) => {
    const [ds, setDs] = useState(getEstadoInicial(clienteId));
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const toast = useToast();

    useEffect(() => {
        if (!isOpen || !clienteId) return;

        setDs(getEstadoInicial(clienteId));

        const cargarDatos = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${apiRender}/api/datosservicio/${clienteId}`);
                if (response.data) {
                    const oldMapped = mapOldToNew(response.data);
                    setDs({ ...getEstadoInicial(clienteId), ...response.data, ...oldMapped, clienteId });
                }
            } catch (error) {
                if (error.response?.status !== 404) {
                    toast({ title: 'Advertencia', description: 'No se pudieron cargar datos previos', status: 'warning', duration: 3000, isClosable: true });
                }
            } finally {
                setIsLoading(false);
            }
        };

        cargarDatos();
    }, [isOpen, clienteId, apiRender, toast]);

    const hc = (field, value) => setDs(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const { id, createdAt, updatedAt, ...dataToSend } = ds;
            dataToSend.clienteId = clienteId;
            await axios.post(`${apiRender}/api/datosservicio`, dataToSend);
            toast({ title: 'Éxito', description: 'Datos guardados correctamente', status: 'success', duration: 3000, isClosable: true });
            onClose();
        } catch (error) {
            console.error('Error al guardar:', error.response?.data);
            toast({ title: 'Error', description: 'No se pudieron guardar los datos', status: 'error', duration: 3000, isClosable: true });
        } finally {
            setIsSaving(false);
        }
    };

    const btnStyle = {
        bg: 'red.500', color: 'white', fontWeight: 'bold', fontSize: 'sm',
        _hover: { bg: 'red.600' }, px: 4, py: 3, w: '100%', textAlign: 'left',
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent w={["90%", "80%", "60%"]} borderRadius="10px">
                <ModalHeader borderRadius="10px 10px 0px 0px" bg="red.500" color="white">
                    Datos del Servicio - {clienteNombre}
                </ModalHeader>
                <ModalCloseButton color="white" />
                <ModalBody py={4} px={3}>
                    {isLoading ? (
                        <Flex justify="center" align="center" minH="200px">
                            <Spinner size="xl" color="red.500" />
                        </Flex>
                    ) : (
                        <Accordion allowMultiple>

                            {/* 1. LUBRICADO */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>1. LUBRICADO</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Cambio de aceite">
                                        <SiNo field="cambioAceite" value={ds.cambioAceite} onChange={hc} />
                                    </Row>
                                    {ds.cambioAceite === 'SI' && (
                                        <Sub label="TIPO:">
                                            <TxtInput field="tipoAceite" value={ds.tipoAceite} onChange={hc} placeholder="Ej: 10W40" />
                                        </Sub>
                                    )}
                                    <Row label="Cambio de filtro de aceite">
                                        <SiNo field="cambioFiltroAceite" value={ds.cambioFiltroAceite} onChange={hc} />
                                    </Row>
                                    {ds.cambioFiltroAceite === 'SI' && (
                                        <Sub label="MARCA:">
                                            <TxtInput field="marcaFiltroAceite" value={ds.marcaFiltroAceite} onChange={hc} placeholder="Marca del filtro" />
                                        </Sub>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 2. CARBURACION */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>2. CARBURACION</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Cambio de mangueras"><SiNo field="cambioMangueras" value={ds.cambioMangueras} onChange={hc} /></Row>
                                    <Row label="Cambio de filtro de nafta"><SiNo field="cambioFiltroNafta" value={ds.cambioFiltroNafta} onChange={hc} /></Row>
                                    <Row label="Cambio de bomba de nafta"><SiNo field="cambioBombaNafta" value={ds.cambioBombaNafta} onChange={hc} /></Row>
                                    <Row label="Cambio de filtro de aire"><SiNo field="cambioFiltroAire" value={ds.cambioFiltroAire} onChange={hc} /></Row>
                                    <Row label="Limpieza y mantenimiento"><SiNo field="limpiezaMantenimiento" value={ds.limpiezaMantenimiento} onChange={hc} /></Row>
                                    {ds.limpiezaMantenimiento === 'SI' && (
                                        <SubGroup>
                                            <Row label="Cambio de reparación"><SiNo field="cambioReparacion" value={ds.cambioReparacion} onChange={hc} /></Row>
                                            <Row label="Cambio de carburador"><SiNo field="cambioCarburador" value={ds.cambioCarburador} onChange={hc} /></Row>
                                        </SubGroup>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 3. CABEZAL */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>3. CABEZAL</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Revisión de asiento de válvulas"><SiNo field="revisionAsientoValvulas" value={ds.revisionAsientoValvulas} onChange={hc} /></Row>
                                    {ds.revisionAsientoValvulas === 'SI' && (
                                        <SubGroup>
                                            <Row label="Reparación y recambio"><SiNo field="reparacionRecambioValvulas" value={ds.reparacionRecambioValvulas} onChange={hc} /></Row>
                                            <Row label="Registro de válvulas"><SiNo field="registroValvulas" value={ds.registroValvulas} onChange={hc} /></Row>
                                            {ds.registroValvulas === 'SI' && (
                                                <Sub label="LUZ:">
                                                    <TxtInput field="luzValvulas" value={ds.luzValvulas} onChange={hc} placeholder="Medida de luz" />
                                                </Sub>
                                            )}
                                        </SubGroup>
                                    )}
                                    <Row label="Cambio de bujía"><SiNo field="cambioBujia" value={ds.cambioBujia} onChange={hc} /></Row>
                                    {ds.cambioBujia === 'SI' && (
                                        <SubGroup>
                                            <Sub label="Tipo:">
                                                <TxtInput field="tipoBujia" value={ds.tipoBujia} onChange={hc} placeholder="Tipo de bujía" />
                                            </Sub>
                                            <Row label="Junta de escape"><SiNo field="juntaEscape" value={ds.juntaEscape} onChange={hc} /></Row>
                                        </SubGroup>
                                    )}
                                    <Row label="Revisión de compresión"><SiNo field="revisionCompresion" value={ds.revisionCompresion} onChange={hc} /></Row>
                                    {ds.revisionCompresion === 'SI' && (
                                        <Sub label="PSI:">
                                            <TxtInput field="psiCompresion" value={ds.psiCompresion} onChange={hc} placeholder="PSI" />
                                        </Sub>
                                    )}
                                    <Row label="Rectificación de cilindro"><SiNo field="rectificacionCilindro" value={ds.rectificacionCilindro} onChange={hc} /></Row>
                                    {ds.rectificacionCilindro === 'SI' && (
                                        <SubGroup>
                                            <Sub label="Medida:">
                                                <TxtInput field="medidaCilindro" value={ds.medidaCilindro} onChange={hc} placeholder="Medida" />
                                            </Sub>
                                            <Sub label="Marca:">
                                                <TxtInput field="marcaCilindro" value={ds.marcaCilindro} onChange={hc} placeholder="Marca" />
                                            </Sub>
                                        </SubGroup>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 4. SISTEMA DE CLUCH */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>4. SISTEMA DE CLUCH</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Cambio de discos"><SiNo field="cambioDisco" value={ds.cambioDisco} onChange={hc} /></Row>
                                    {ds.cambioDisco === 'SI' && (
                                        <Sub label="Marca:">
                                            <TxtInput field="marcaDiscos" value={ds.marcaDiscos} onChange={hc} placeholder="Marca de discos" />
                                        </Sub>
                                    )}
                                    <Row label="Recambio de canasta"><SiNo field="recambioCanasta" value={ds.recambioCanasta} onChange={hc} /></Row>
                                    <Row label="Revisión de centrífugo"><SiNo field="revisionCentrifugo" value={ds.revisionCentrifugo} onChange={hc} /></Row>
                                    {ds.revisionCentrifugo === 'SI' && (
                                        <SubGroup>
                                            <Row label="Recambio centrífugo simple"><SiNo field="recambioCentrifugoSimple" value={ds.recambioCentrifugoSimple} onChange={hc} /></Row>
                                            <Row label="Recambio embrague con centrífugo"><SiNo field="recambioEmbragueCentrifugo" value={ds.recambioEmbragueCentrifugo} onChange={hc} /></Row>
                                        </SubGroup>
                                    )}
                                    <Row label="Cambio de junta tapa de embrague"><SiNo field="cambioJuntaTapaEmbrague" value={ds.cambioJuntaTapaEmbrague} onChange={hc} /></Row>
                                    <Row label="Revisión de bomba de aceite"><SiNo field="revisionBombaAceite" value={ds.revisionBombaAceite} onChange={hc} /></Row>
                                    {ds.revisionBombaAceite === 'SI' && (
                                        <Sub label="Recambio:">
                                            <TxtInput field="recambioBombaAceite" value={ds.recambioBombaAceite} onChange={hc} placeholder="Detallar recambio" />
                                        </Sub>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 5. SISTEMA ELÉCTRICO */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>5. SISTEMA ELÉCTRICO</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Prueba de batería">
                                        <BuenoMalo field="pruebaBateria" value={ds.pruebaBateria} onChange={hc} />
                                    </Row>
                                    <Row label="Medición:">
                                        <TxtInput field="medicionBateria" value={ds.medicionBateria} onChange={hc} placeholder="Ej: 12.6V" />
                                    </Row>
                                    <Row label="Prueba del sistema de carga"><SiNo field="pruebaSistemaCarga" value={ds.pruebaSistemaCarga} onChange={hc} /></Row>
                                    {ds.pruebaSistemaCarga === 'SI' && (
                                        <SubGroup>
                                            <Row label="Cambio de regulador"><SiNo field="cambioRegulador" value={ds.cambioRegulador} onChange={hc} /></Row>
                                            <Row label="Cambio de batería"><SiNo field="cambioBateria" value={ds.cambioBateria} onChange={hc} /></Row>
                                            <Row label="Cambio de estátor"><SiNo field="cambioEstator" value={ds.cambioEstator} onChange={hc} /></Row>
                                        </SubGroup>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 6. LUCES Y BOTONES */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>6. LUCES Y BOTONES</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Encendido eléctrico"><SiNo field="encendidoElectrico" value={ds.encendidoElectrico} onChange={hc} /></Row>
                                    {ds.encendidoElectrico === 'SI' && (
                                        <SubGroup>
                                            <Row label="Cambio de botón"><SiNo field="cambioBoton" value={ds.cambioBoton} onChange={hc} /></Row>
                                            <Row label="Cambio de relay solenoide"><SiNo field="cambioRelaySolenoide" value={ds.cambioRelaySolenoide} onChange={hc} /></Row>
                                            <Row label="Cambio de bendix"><SiNo field="cambioBendix" value={ds.cambioBendix} onChange={hc} /></Row>
                                            <Row label="Reparación de bendix"><SiNo field="reparacionBendix" value={ds.reparacionBendix} onChange={hc} /></Row>
                                            <Row label="Reparación de arrastre de burro"><SiNo field="reparacionArrastreBurro" value={ds.reparacionArrastreBurro} onChange={hc} /></Row>
                                            <Row label="Reparación de problema eléctrico"><SiNo field="reparacionProblemaElectrico" value={ds.reparacionProblemaElectrico} onChange={hc} /></Row>
                                            {ds.reparacionProblemaElectrico === 'SI' && (
                                                <Sub label="Cuál:">
                                                    <TxtInput field="cualProblemaElectrico" value={ds.cualProblemaElectrico} onChange={hc} placeholder="Describir problema" />
                                                </Sub>
                                            )}
                                        </SubGroup>
                                    )}
                                    <Row label="Prueba de luces"><SiNo field="pruebaDeLuces" value={ds.pruebaDeLuces} onChange={hc} /></Row>
                                    {ds.pruebaDeLuces === 'SI' && (
                                        <Sub label="Recambio de focos:">
                                            <TxtInput field="recambioFocos" value={ds.recambioFocos} onChange={hc} placeholder="Detallar focos" />
                                        </Sub>
                                    )}
                                    <Row label="Prueba de botones"><SiNo field="pruebaBotones" value={ds.pruebaBotones} onChange={hc} /></Row>
                                    {ds.pruebaBotones === 'SI' && (
                                        <Sub label="Recambio:">
                                            <TxtInput field="recambioBotones" value={ds.recambioBotones} onChange={hc} placeholder="Detallar recambio" />
                                        </Sub>
                                    )}
                                    <Row label="Prueba de bocina"><SiNo field="pruebaBocina" value={ds.pruebaBocina} onChange={hc} /></Row>
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 7. SISTEMA DE FRENOS */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>7. SISTEMA DE FRENOS</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Freno delantero"><SiNo field="frenoDelantero" value={ds.frenoDelantero} onChange={hc} /></Row>
                                    {ds.frenoDelantero === 'SI' && (
                                        <SubGroup>
                                            <Row label="Recambio de pastillas"><SiNo field="recambioPastillasDelantera" value={ds.recambioPastillasDelantera} onChange={hc} /></Row>
                                            <Row label="Recambio de zapatas"><SiNo field="recambioZapatasDelantera" value={ds.recambioZapatasDelantera} onChange={hc} /></Row>
                                            <Row label="Líquido de freno"><SiNo field="liquidoFrenoDelantero" value={ds.liquidoFrenoDelantero} onChange={hc} /></Row>
                                            <Row label="Bomba de freno"><SiNo field="bombaFrenoDelantera" value={ds.bombaFrenoDelantera} onChange={hc} /></Row>
                                            <Row label="Cáliper de freno"><SiNo field="calisperFrenoDelantero" value={ds.calisperFrenoDelantero} onChange={hc} /></Row>
                                            <Row label="Cable de freno"><SiNo field="cableFrenoDelantero" value={ds.cableFrenoDelantero} onChange={hc} /></Row>
                                            <Sub label="Otros:">
                                                <TxtInput field="otrosFrenoDelantero" value={ds.otrosFrenoDelantero} onChange={hc} placeholder="Otros" />
                                            </Sub>
                                        </SubGroup>
                                    )}
                                    <Row label="Freno trasero"><SiNo field="frenoTrasero" value={ds.frenoTrasero} onChange={hc} /></Row>
                                    {ds.frenoTrasero === 'SI' && (
                                        <SubGroup>
                                            <Row label="Recambio de pastillas"><SiNo field="recambioPastillasTrasera" value={ds.recambioPastillasTrasera} onChange={hc} /></Row>
                                            <Row label="Recambio de zapatas"><SiNo field="recambioZapatasTrasera" value={ds.recambioZapatasTrasera} onChange={hc} /></Row>
                                            <Row label="Líquido de freno"><SiNo field="liquidoFrenoTrasero" value={ds.liquidoFrenoTrasero} onChange={hc} /></Row>
                                            <Row label="Bomba de freno"><SiNo field="bombaFrenoTrasera" value={ds.bombaFrenoTrasera} onChange={hc} /></Row>
                                            <Row label="Cáliper de freno"><SiNo field="calisperFrenoTrasero" value={ds.calisperFrenoTrasero} onChange={hc} /></Row>
                                            <Row label="Varilla de freno"><SiNo field="varrillaFrenoTrasero" value={ds.varrillaFrenoTrasero} onChange={hc} /></Row>
                                            <Sub label="Otros:">
                                                <TxtInput field="otrosFrenoTrasero" value={ds.otrosFrenoTrasero} onChange={hc} placeholder="Otros" />
                                            </Sub>
                                        </SubGroup>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 8. SISTEMA DE ARRASTRE */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>8. SISTEMA DE ARRASTRE</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Recambio de transmisión completa"><SiNo field="recambioTransmisionCompleta" value={ds.recambioTransmisionCompleta} onChange={hc} /></Row>
                                    {ds.recambioTransmisionCompleta === 'SI' && (
                                        <SubGroup>
                                            <Sub label="Tipo:">
                                                <TxtInput field="tipoTransmision" value={ds.tipoTransmision} onChange={hc} placeholder="Tipo de transmisión" />
                                            </Sub>
                                            <Row label="Registro lavado y lubricado"><SiNo field="registroLavadoLubricado" value={ds.registroLavadoLubricado} onChange={hc} /></Row>
                                            <Row label="Cambio de tacos o bujes de masa"><SiNo field="cambioTacosBujesMasa" value={ds.cambioTacosBujesMasa} onChange={hc} /></Row>
                                            <Row label="Cambio de eje trasero"><SiNo field="cambioEjeTrasero" value={ds.cambioEjeTrasero} onChange={hc} /></Row>
                                            <Row label="Cambio de porta corona"><SiNo field="cambioPortaCorona" value={ds.cambioPortaCorona} onChange={hc} /></Row>
                                            <Row label="Cambio de tornillos y seguros"><SiNo field="cambioTornillosSeguros" value={ds.cambioTornillosSeguros} onChange={hc} /></Row>
                                            <Row label="Cambio de rulemanes"><SiNo field="cambioRulemanes" value={ds.cambioRulemanes} onChange={hc} /></Row>
                                            {ds.cambioRulemanes === 'SI' && (
                                                <Sub label="Cuáles:">
                                                    <TxtInput field="cualesRulemanes" value={ds.cualesRulemanes} onChange={hc} placeholder="Especificar rulemanes" />
                                                </Sub>
                                            )}
                                        </SubGroup>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 9. RETENES Y ORING */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>9. RETENES Y ORING</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Cambio de retenes"><SiNo field="cambioRetenes" value={ds.cambioRetenes} onChange={hc} /></Row>
                                    {ds.cambioRetenes === 'SI' && (
                                        <Sub label="Cuáles:">
                                            <TxtInput field="cualesRetenes" value={ds.cualesRetenes} onChange={hc} placeholder="Especificar retenes" />
                                        </Sub>
                                    )}
                                    <Row label="Cambio de oring"><SiNo field="cambioOring" value={ds.cambioOring} onChange={hc} /></Row>
                                    {ds.cambioOring === 'SI' && (
                                        <Sub label="Cuáles:">
                                            <TxtInput field="cualesOring" value={ds.cualesOring} onChange={hc} placeholder="Especificar orings" />
                                        </Sub>
                                    )}
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 10. SISTEMA DE AMORTIGUACION */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>10. SISTEMA DE AMORTIGUACION</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Mantenimiento de barras y vástagos delanteros"><SiNo field="mantenimientoBarrasVastagos" value={ds.mantenimientoBarrasVastagos} onChange={hc} /></Row>
                                    <Row label="Cambio de líquido hidráulico"><SiNo field="cambioLiquidoHidraulico" value={ds.cambioLiquidoHidraulico} onChange={hc} /></Row>
                                    <Row label="Cambio de resortes"><SiNo field="cambioResortes" value={ds.cambioResortes} onChange={hc} /></Row>
                                    <Row label="Cambio de retenes"><SiNo field="cambioRetenesSuspension" value={ds.cambioRetenesSuspension} onChange={hc} /></Row>
                                    {ds.cambioRetenesSuspension === 'SI' && (
                                        <Sub label="Medidas:">
                                            <TxtInput field="medidasRetenesSuspension" value={ds.medidasRetenesSuspension} onChange={hc} placeholder="Medidas" />
                                        </Sub>
                                    )}
                                    <Row label="Cambio de bolilleros direccionales"><SiNo field="cambioBolillerosDireccionales" value={ds.cambioBolillerosDireccionales} onChange={hc} /></Row>
                                    <Row label="Mantenimiento trasero de amortiguación"><SiNo field="mantenimientoTraserAmortiguacion" value={ds.mantenimientoTraserAmortiguacion} onChange={hc} /></Row>
                                    <Row label="Cambio de bujes de horquillón"><SiNo field="cambioBujesHorquillon" value={ds.cambioBujesHorquillon} onChange={hc} /></Row>
                                    {ds.cambioBujesHorquillon === 'SI' && (
                                        <Sub label="Medida:">
                                            <TxtInput field="medidaBujesHorquillon" value={ds.medidaBujesHorquillon} onChange={hc} placeholder="Medida" />
                                        </Sub>
                                    )}
                                    <Row label="Cambio de eje de horquillón"><SiNo field="cambioEjeHorquillon" value={ds.cambioEjeHorquillon} onChange={hc} /></Row>
                                    <Row label="Cambio de bujes de monoshock"><SiNo field="cambioBujesMonoshock" value={ds.cambioBujesMonoshock} onChange={hc} /></Row>
                                    <Row label="Cambio de monoshock"><SiNo field="cambioMonoshock" value={ds.cambioMonoshock} onChange={hc} /></Row>
                                    <Row label="Cambio de amortiguadores"><SiNo field="cambioAmortiguadores" value={ds.cambioAmortiguadores} onChange={hc} /></Row>
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 11. TABLERO */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>11. TABLERO</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Row label="Problema eléctrico"><SiNo field="problemaElectricoTablero" value={ds.problemaElectricoTablero} onChange={hc} /></Row>
                                    {ds.problemaElectricoTablero === 'SI' && (
                                        <Sub label="Cuál:">
                                            <TxtInput field="cualProblemaTablero" value={ds.cualProblemaTablero} onChange={hc} placeholder="Describir problema" />
                                        </Sub>
                                    )}
                                    <Row label="Velocímetro"><SiNo field="velocimetro" value={ds.velocimetro} onChange={hc} /></Row>
                                    <Row label="Cambio de retorno"><SiNo field="cambioRetorno" value={ds.cambioRetorno} onChange={hc} /></Row>
                                    <Row label="Cambio de cable"><SiNo field="cambioCableTablero" value={ds.cambioCableTablero} onChange={hc} /></Row>
                                </AccordionPanel>
                            </AccordionItem>

                            {/* 12. OTRO TRABAJO */}
                            <AccordionItem border="none" mb={1}>
                                <AccordionButton {...btnStyle} borderRadius="md">
                                    <Box flex={1}>12. OTRO TRABAJO A DESCRIBIR</Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={3} pt={2} bg="gray.50" borderRadius="0 0 6px 6px">
                                    <Input
                                        value={ds.otrosTrabajos}
                                        onChange={e => hc('otrosTrabajos', e.target.value)}
                                        placeholder="Describir otros trabajos realizados..."
                                        size="sm"
                                    />
                                </AccordionPanel>
                            </AccordionItem>

                        </Accordion>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="gray" mr={3} onClick={onClose} isDisabled={isSaving}>
                        Cancelar
                    </Button>
                    <Button colorScheme="red" onClick={handleSubmit} isLoading={isSaving} loadingText="Guardando...">
                        Guardar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default DatosServicioModal;
