class Permissions
{
    constructor(initBoolean=true)
    {
        this.can_send_messages = initBoolean;
        this.can_send_media_messages = initBoolean;
        this.can_send_polls = initBoolean;
        this.can_send_other_messages = initBoolean;
        this.can_add_web_page_previews = initBoolean;
        this.can_change_info = initBoolean;
        this.can_invite_users = initBoolean;
        this.can_pin_messages = initBoolean;
    }
}
module.exports = Permissions;