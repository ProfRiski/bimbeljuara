// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Javascript module to control the template editor.
 *
 * @module      mod_data/templateseditor
 * @copyright   2021 Mihail Geshoski <mihail@moodle.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {get_string as getString} from 'core/str';
import {prefetchStrings} from 'core/prefetch';
import {relativeUrl} from 'core/url';
import {saveCancel} from 'core/notification';

prefetchStrings('admin', ['confirmation']);
prefetchStrings('mod_data', [
    'resettemplateconfirmtitle',
    'resettemplateconfirm',
    'resettemplate',
    'enabletemplateeditorcheck',
    'editorenable'
]);

/**
 * Template editor constants.
 */
const selectors = {
    toggleTemplateEditor: 'input[name="useeditor"]',
    resetTemplate: 'input[name="defaultform"]',
    resetButton: 'input[name="resetbutton"]',
    editForm: '#edittemplateform',
};

/**
 * Register event listeners for the module.
 *
 * @param {int} instanceId The database ID
 * @param {string} mode The template mode
 */
const registerEventListeners = (instanceId, mode) => {
    registerResetButton();
    registerEditorToggler(instanceId, mode);
};

const registerResetButton = () => {
    const editForm = document.querySelector(selectors.editForm);
    const resetButton = document.querySelector(selectors.resetButton);
    const resetTemplate = document.querySelector(selectors.resetTemplate);

    if (!resetButton || !resetTemplate || !editForm) {
        return;
    }

    resetButton.addEventListener('click', async(event) => {
        event.preventDefault();
        saveCancel(
            getString('resettemplateconfirmtitle', 'mod_data'),
            getString('resettemplateconfirm', 'mod_data'),
            getString('resettemplate', 'mod_data'),
            () => {
                resetTemplate.value = "true";
                editForm.submit();
            },
            null,
            {triggerElement: event.target}
        );
    });
};

const registerEditorToggler = (instanceId, mode) => {
    const toggleTemplateEditor = document.querySelector(selectors.toggleTemplateEditor);

    if (!toggleTemplateEditor) {
        return;
    }

    toggleTemplateEditor.addEventListener('click', async(event) => {
        event.preventDefault();
        // Whether the event action attempts to enable or disable the template editor.
        const enableTemplateEditor = event.target.checked;

        if (enableTemplateEditor) {
            // Display a confirmation dialog before enabling the template editor.
            saveCancel(
                getString('confirmation', 'admin'),
                getString('enabletemplateeditorcheck', 'mod_data'),
                getString('editorenable', 'mod_data'),
                () => {
                    window.location = relativeUrl('/mod/data/templates.php', {d: instanceId, mode: mode, useeditor: true});
                },
                null,
                {triggerElement: event.target}
            );
        } else {
            window.location = relativeUrl('/mod/data/templates.php', {d: instanceId, mode: mode, useeditor: false});
        }
    });
};

/**
 * Initialize the module.
 *
 * @param {int} instanceId The database ID
 * @param {string} mode The template mode
 */
export const init = (instanceId, mode) => {
    registerEventListeners(instanceId, mode);
};
