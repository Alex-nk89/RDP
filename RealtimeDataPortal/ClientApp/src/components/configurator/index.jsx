import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";

import { useNotification } from "../../hooks/useNotification";
import { useForm } from '@mantine/hooks';
import { TextInput, Space, Button, MultiSelect, ActionIcon, Tabs, Select, Loader, Checkbox, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';

import { IoAdd } from 'react-icons/io5';

import { useRequest } from "../../hooks/useRequest";
import AddChangeFolder from "./forms/folder/AddChangeFolder";
import ErrorsPage from '../errors-page/ErrorsPage';
import AppPreloader from "../loader/appPreloader";
import AddChangeExternalPage from './forms/external-page/AddChangeExternalPage';
import Tag from './forms/tag/Tag';
import AddChangeTag from './forms/tag/AddChangeTag';
import DeleteElements from './forms/delete-elements/DeleteElements';

const attributesInputs = {
	required: true,
    autoComplete: 'off'
}

export { useEffect, useState, useParams, useRequest, useNotification, useRef,
    AddChangeFolder, AppPreloader, ErrorsPage, AddChangeExternalPage, Tag, AddChangeTag, DeleteElements,
    attributesInputs,
    TextInput, Space, Button, useForm, MultiSelect, ActionIcon, Tabs, Select, Loader, Checkbox, useModals, Text,
    IoAdd };