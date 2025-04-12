package com.example.myproject.Service;

import com.example.myproject.Common.FollowStatus;
import com.example.myproject.Common.FriendStatus;
import com.example.myproject.Dto.FriendDto;
import com.example.myproject.Dto.FriendRequestDto;
import com.example.myproject.Entity.Friend;
import com.example.myproject.Entity.User;
import com.example.myproject.Repository.FriendRepository;
import com.example.myproject.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class FriendService {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;

    //팔로잉 요청
    public void requestFollowing(FriendRequestDto dto){
        Optional<User> userOptional = userRepository.findById(dto.getUserId());
        Optional<User> friendOptional = userRepository.findById(dto.getFriendUserId());
        User _user = null;
        User _friend = null;
        if(userOptional.isEmpty()){
            throw new RuntimeException("친구 요청을 할 수 없는 상태입니다.");
        } else{
            _user = userOptional.get();
        }
        if(friendOptional.isEmpty()){
            throw new RuntimeException("해당 사용자를 찾을 수 없습니다.");
        } else {
            _friend = friendOptional.get();
        }

        Friend friend = new Friend();
        friend.setUser(_user);
        friend.setFriendUser(_friend);
        friend.setFriendStatus(FriendStatus.REQUESTED);
        friendRepository.save(friend);
    }

    //팔로잉 수락(상태 수정)
    public void acceptFollowing(FriendDto dto){
        Optional<Friend> optionalFriend = friendRepository.findById(dto.getFriendId());
        Friend _friend = null;
        if (optionalFriend.isEmpty()){
            throw new RuntimeException("해당 요청을 찾을 수 없습니다.");
        } else {
            _friend = optionalFriend.get();
        }

        _friend.setFriendStatus(FriendStatus.ACCEPTED);
        _friend.setFollowStatus(FollowStatus.FRIEND);
        friendRepository.save(_friend);
    }

    //팔로잉 취소,거절
    public void deleteFollowing(long friendId){
        Optional<Friend> _friend = friendRepository.findById(friendId);
        if(_friend.isEmpty()){
            throw new RuntimeException("해당 친구 목록을 찾을 수 없습니다.");
        }
        friendRepository.deleteById(friendId);
    }

    //친구 목록 조회
    public Page<Friend> getFriendList(String userId, int page){
        Optional<User> optionalUser = userRepository.findById(userId);
        User _user = null;
        if (optionalUser.isEmpty()){
            throw new RuntimeException("해당 사용자를 찾을 수 없습니다.");
        } else{
            _user = optionalUser.get();
        }
        PageRequest pageRequest = PageRequest.of(page, 10, Sort.by(Sort.Direction.DESC, "createdDt"));
        return friendRepository.findByUserOrderByCreatedDtDesc(_user, pageRequest);
    }
}
