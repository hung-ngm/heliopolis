import { NextPage } from 'next';
import React from 'react'
import { Group } from 'components/templates/chat/group';
import { Chat } from 'components/templates/chat'

const GroupPage: NextPage = () => {
  return (
    <Chat>
      <Group />
    </Chat>
  );
};

export default GroupPage;