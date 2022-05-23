import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
    ActionIcon, Button, ColorInput, Group, Input, Loader, NumberInput, Popover, Select, Space, Stepper,
    Text, TextInput, Tooltip, NativeSelect
} from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useResizeObserver } from '@mantine/hooks';

import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';

import {
    BsFillSquareFill, BsFillCircleFill, BsSlashLg, BsType, BsTriangleFill, BsFonts, BsGripHorizontal, BsGripVertical, BsSave, BsArrowDown,
    BsSquare, BsBorderWidth, BsArrow90DegRight, BsArrow90DegUp, BsBorderStyle, BsArrowBarRight, BsArrowBarDown, BsTrash, BsOption,
    BsAlt, BsArrowClockwise, BsArrowsAngleExpand, BsFillBadgeAdFill, BsFillFileEarmarkImageFill, BsWawyLine, BsSemicircle,
    BsFillPaletteFill, BsFront, BsBack, BsFillPlusSquareFill, BsFillSaveFill, BsListOl, BsFillImageFill, BsChevronUp, BsChevronDown, BsTypeBold
} from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';

import { useRequest } from '../../../../hooks/useRequest';
import { useNotification } from '../../../../hooks/useNotification';

import { MnemoschemeEditorForm } from './block-form/MnemoschemeEditorForm';
import { MnemoschemeEditorPreview } from './block-preview/MnemoschemeEditorPreview';
import { MnemoschemeEditorPanelCreateElements } from './block-create/MnemoschemeEditorPanelCreateElements';
import { MnemoschemeEditorPanelChangeElements } from './block-change/MnemoschemeEditorPanelChangeElements';
import { MnemoschemeEditorPanelColorsAttribute } from './block-change/MnemoschemeEditorPanelColorsAttribute';
import { MnemoschemeEditorPanelDimensionsAttribute } from './block-change/MnemoschemeEditorPanelDimensionsAttribute';
import { MnemoschemeEditorPanelStrokeAttribute } from './block-change/MnemoschemeEditorPanelStrokeAttribute';
import { MnemoschemeEditorPanelTextAttribute } from './block-change/MnemoschemeEditorPanelTextAttribute';
import { MnemoschemeEditorPanelCanvasAttribute } from './block-change/MnemoschemeEditorPanelCanvasAttribute';

const attributesInputs = {
    required: true,
    autoComplete: 'off'
};

export {
    useState, useEffect, useRef, useMemo,
    useParams, Redirect,
    useSelector, useDispatch,
    useForm,
    ActionIcon, Button, ColorInput, Group, Input, Loader, NumberInput, Popover, Select, Space, Stepper, Text, TextInput,
    Tooltip, NativeSelect, useResizeObserver,
    FabricJSCanvas, useFabricJSEditor, fabric,
    BsFillSquareFill, BsFillCircleFill, BsSlashLg, BsType, BsTriangleFill, BsFonts, BsGripHorizontal, BsSave, BsArrowDown, BsGripVertical,
    BsSquare, BsBorderWidth, BsArrow90DegRight, BsArrow90DegUp, BsBorderStyle, BsArrowBarRight, BsArrowBarDown, BsTrash, BsOption, BsAlt,
    BsArrowClockwise, BsArrowsAngleExpand, BsFillBadgeAdFill, IoSend, BsFillFileEarmarkImageFill, BsWawyLine, BsSemicircle,
    BsFillPaletteFill, BsFront, BsBack, BsFillPlusSquareFill, BsFillSaveFill, BsListOl, BsFillImageFill, BsChevronUp, BsChevronDown, BsTypeBold,
    useRequest, useNotification,
    MnemoschemeEditorForm, MnemoschemeEditorPreview, MnemoschemeEditorPanelCreateElements,
    MnemoschemeEditorPanelChangeElements, MnemoschemeEditorPanelColorsAttribute, MnemoschemeEditorPanelDimensionsAttribute,
    MnemoschemeEditorPanelStrokeAttribute, MnemoschemeEditorPanelTextAttribute, MnemoschemeEditorPanelCanvasAttribute,
    attributesInputs
}