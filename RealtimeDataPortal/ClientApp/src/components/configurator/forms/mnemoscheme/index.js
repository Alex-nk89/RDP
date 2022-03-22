import { useState, useEffect, useRef } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { ActionIcon, Button, ColorInput, Popover, Space, Stepper, Text, TextInput, Tooltip } from '@mantine/core';

import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import { fabric } from 'fabric';

import { BsFillSquareFill, BsFillCircleFill, BsSlashLg, BsType, BsTriangleFill, BsFonts, BsGripVertical } from 'react-icons/bs';
import { IoSend } from 'react-icons/io5';

import { useRequest } from '../../../../hooks/useRequest';
import { useNotification } from '../../../../hooks/useNotification';

import { MnemoschemeEditorForm } from './block-form/MnemoschemeEditorForm';
import { MnemoschemeEditorPreview } from './block-preview/MnemoschemeEditorPreview';
import { MnemoschemeEditorPanel } from './block-create/MnemoschemeEditorPanel';
import { MnemoschemeEditorPanelCreateElements } from './block-create/MnemoschemeEditorPanelCreateElements';

const attributesInputs = {
    required: true,
    autoComplete: 'off'
};

export {
    useState, useEffect, useRef,
    useParams, Redirect,
    useSelector, useDispatch,
    ActionIcon, Button, ColorInput, Popover, Space, Stepper, Text, TextInput, Tooltip,
    FabricJSCanvas, useFabricJSEditor, fabric,
    BsFillSquareFill, BsFillCircleFill, BsSlashLg, BsType, BsTriangleFill, BsFonts, BsGripVertical, IoSend,
    useRequest, useNotification,
    MnemoschemeEditorForm, MnemoschemeEditorPreview, MnemoschemeEditorPanel, MnemoschemeEditorPanelCreateElements,
    attributesInputs
}