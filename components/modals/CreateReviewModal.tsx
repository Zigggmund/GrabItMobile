import { ReviewType } from '@/services/api/services/dto/review.dto';

import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCreateReview } from '@/hooks/review/useCreateReview';
import { useLanguage } from '@/hooks/useLanguage';
import { useTheme } from '@/hooks/useTheme';

import { CustomButton } from '@/components/ui/button/CustomButton';
import { CustomIcon } from '@/components/ui/icon/CustomIcon';
import CustomInput from '@/components/ui/input/CustomInput';
import { CustomText } from '@/components/ui/text/CustomText';

import { icons } from '@/constants/icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  bookingId: string;
  reviewType: ReviewType;
}

export default function CreateReviewModal({
  visible,
  onClose,
  bookingId,
  reviewType,
}: Props) {
  const { l } = useLanguage();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { mutate, isPending, error, reset } = useCreateReview();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (visible) {
      setRating(0);
      setComment('');
      reset();
    }
  }, [visible]);

  const title =
    reviewType === 'renter_to_listing'
      ? l.reviewAboutListing
      : l.reviewAboutRenter;

  const handleSubmit = () => {
    if (rating === 0) return;
    mutate(
      {
        bookingId,
        dto: { review_type: reviewType, rating, comment: comment || undefined },
      },
      { onSuccess: onClose },
    );
  };

  const isAlreadyReviewed = (error as any)?.message?.includes('already');

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: '#00000066',
            justifyContent: 'flex-end',
            paddingBottom: insets.bottom,
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />

          <View
            style={{
              backgroundColor: colors.theme.white.bright,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              gap: 20,
            }}
          >
            <CustomText
              highlight
              className="text-22 font-bold text-center"
              style={{ color: colors.theme.blue.dark }}
            >
              {title}
            </CustomText>

            {/* Stars */}
            <View className="flex-row gap-3 justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                >
                  <CustomIcon
                    source={star <= rating ? icons.starFilled : icons.starEmpty}
                    size={40}
                    color={
                      star <= rating
                        ? colors.base.orange.primary
                        : colors.theme.grey.dark
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>

            {rating > 0 && (
              <CustomText
                className="text-15 text-center"
                style={{ color: colors.theme.blue.bright }}
              >
                {rating} / 5
              </CustomText>
            )}

            {/* Comment */}
            <CustomInput
              label={l.reviewCommentLabel}
              placeholder={l.reviewCommentPlaceholder}
              value={comment}
              onChangeText={setComment}
              multiline
            />

            {isAlreadyReviewed ? (
              <CustomText
                className="text-14 text-center"
                style={{ color: colors.base.red.primary }}
              >
                {l.reviewAlreadyLeft}
              </CustomText>
            ) : (
              error && (
                <CustomText
                  className="text-14 text-center"
                  style={{ color: colors.base.red.primary }}
                >
                  {(error as any).message}
                </CustomText>
              )
            )}

            <CustomButton
              type="highlighted"
              text={l.btnSend}
              disabled={isPending || rating === 0}
              onPress={handleSubmit}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
