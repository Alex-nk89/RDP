import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from '@mantine/hooks';
import { IoSearch } from 'react-icons/io5';

import { Tabs, TextInput, Space, ColorInput, Loader, Select, Button } from '@mantine/core';

import { useRequest } from '../../hooks/useRequest';
import { useNotification } from '../../hooks/useNotification';

import ErrorsPage from '../errors-page/ErrorsPage';
import { ChangeParameterType } from './change-parameter-type/ChangeParameterType';
import { EditServer } from './edit-server/EditServer';
import DeleteElements from '../delete-elements/DeleteElements';

const attributesInputs = {
    required: true,
    autoComplete: 'off'
};

export {
    useState, useEffect, useRef,
    useParams,
    useForm,
    IoSearch,
    Tabs, TextInput, Space, ColorInput, Loader, Select, Button,
    useRequest, useNotification,
    ErrorsPage, ChangeParameterType, EditServer, DeleteElements,
    attributesInputs
};