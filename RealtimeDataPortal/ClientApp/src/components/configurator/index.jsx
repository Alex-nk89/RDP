import { useEffect, useState, useRef } from 'react';
import { useParams } from "react-router-dom";

import { useNotification } from "../../hooks/useNotification";
import { useForm } from '@mantine/hooks';
import { TextInput, Space, Button, MultiSelect, ActionIcon, Tabs, Select, Loader } from '@mantine/core';

import { IoAdd } from 'react-icons/io5';

import { useRequest } from "../../hooks/useRequest";
import AddChangeFolder from "./forms/folder/AddChangeFolder";
import ErrorsPage from '../errors-page/ErrorsPage';
import AppPreloader from "../loader/appPreloader";
import AddChangeExternalPage from './forms/external-page/AddChangeExternalPage';
import Tag from './forms/tag/Tag';
import AddChangeTag from './forms/tag/AddChangeTag';

const attributesInputs = {
	required: true,
    autoComplete: 'off'
}

export { useEffect, useState, useParams, useRequest, useNotification, useRef,
    AddChangeFolder, AppPreloader, ErrorsPage, AddChangeExternalPage, Tag, AddChangeTag,
    attributesInputs,
    TextInput, Space, Button, useForm, MultiSelect, ActionIcon, Tabs, Select, Loader,
    IoAdd };