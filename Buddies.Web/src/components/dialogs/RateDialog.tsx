import React from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Rating from '@mui/material/Rating';
import { Typography } from '@mui/material';
import { UserInfoResponse } from '../../api/model/userInfoResponse';
import { RateBuddiesRequest } from '../../api/model/rateBuddiesRequest';

interface Props {
  open: boolean;
  closeDialog: () => void;
  onSubmit: SubmitHandler<RateBuddiesRequest>
  peers: UserInfoResponse[];
}

const RateDialog : React.VFC<Props> = ({
  open,
  closeDialog,
  onSubmit,
  peers,
}) => {
  const { control, handleSubmit, reset } = useForm<RateBuddiesRequest>({
    defaultValues: {
      buddyScores: peers.reduce((scores, peer) => {
        // eslint-disable-next-line no-param-reassign
        scores[peer.userId.toString()] = 0;
        return scores;
      }, {} as RateBuddiesRequest['buddyScores']),
    },
  });

  const handleClose = () => {
    closeDialog();
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>Rate Members</DialogTitle>
      <DialogContent sx={{ px: 3 }}>
        {peers.map((peer) => {
          return (
            <>
              <Typography component="legend">{`${peer.firstName} ${peer.lastName}`}</Typography>
              <Controller
                control={control}
                name={`buddyScores.${peer.userId}`}
                render={({ field }) => {
                  return (
                    <Rating
                      value={field.value}
                      onChange={(_, value) => field.onChange(value)}
                    />
                  );
                }}
              />
            </>

          );
        })}
      </DialogContent>

    </Dialog>
  );
};

export default RateDialog;
