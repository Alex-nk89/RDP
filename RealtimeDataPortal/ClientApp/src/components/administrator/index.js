import { useState, useEffect, useRef, forwardRef } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from '@mantine/hooks';
import { BsSearch } from 'react-icons/bs';

import { Tabs, TextInput, Space, ColorInput, Loader, Select, Button, Checkbox, Autocomplete } from '@mantine/core';

import { useRequest } from '../../hooks/useRequest';
import { useNotification } from '../../hooks/useNotification';

import ErrorsPage from '../errors-page/ErrorsPage';
import AppPreloader from '../loader/appPreloader';
import { ChangeParameterType } from './change-parameter-type/ChangeParameterType';
import { EditServer } from './edit-server/EditServer';
import { EditTypeTag } from './edit-type-tag/EditTypeTag';
import DeleteElements from '../delete-elements/DeleteElements';
import { AccessProfiles } from './access-profiles/AccessProfiles';

const attributesInputs = {
    required: true,
    autoComplete: 'off'
};

export {
    useState, useEffect, useRef, forwardRef,
    useParams,
    useForm,
    BsSearch,
    Tabs, TextInput, Space, ColorInput, Loader, Select, Button, Checkbox, Autocomplete,
    useRequest, useNotification,
    AppPreloader, ErrorsPage, ChangeParameterType, EditServer, EditTypeTag, DeleteElements, AccessProfiles,
    attributesInputs
};