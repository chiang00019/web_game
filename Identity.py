import re
import os
import threading
import datetime
from playwright.sync_api import Playwright, sync_playwright
from dotenv import load_dotenv
# 載入 .env 檔
load_dotenv()

# 讀取環境變數
topup_account = os.getenv("TOPUP_ACCOUNT")
topup_password = os.getenv("TOPUP_PASSWORD")
topup_otp_code = os.getenv("TOPUP_OTP_CODE")


screenshot_lock = threading.Lock()

def take_screenshot(game_name, uid, page=None, element=None):
    """
    截圖函式，可截取特定元素（element）或整頁（page）。
    使用高精度時間戳確保檔名唯一。
    """
    # 為本次執行建立唯一的子資料夾路徑
    run_specific_folder = os.path.join("screenshots", f"{game_name}_{uid}")
    os.makedirs(run_specific_folder, exist_ok=True)

    # 使用包含微秒的高精度時間戳來命名，避免衝突
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    filename = os.path.join(run_specific_folder, f"{timestamp}.png")

    if element:
        element.screenshot(path=filename)
    elif page:
        page.screenshot(path=filename, full_page=True)
    else:
        raise ValueError("必須傳入 page 或 element 作為截圖來源")

    print(f"✅ 已儲存截圖：{filename}")


def check_game_info(page, expected_game_name, context, browser):
    """
    從畫面抓取顯示的角色名稱，並比對是否與輸入一致。
    若不符，會自動關閉上下文與瀏覽器，並結束程式，避免誤付。
    """
    try:
        # 直接使用 class 抓取 value（第二個 disabled 輸入框）
        locator = page.locator("input.bui-input.gc-input-pc.bui-input-disabled").nth(1)
        text = locator.input_value().strip()
        print(f"[抓取成功] {text}")

        # 解析角色名稱
        if "(" in text and text.endswith(")"):
            name_part = text.split("(")[0].strip()
            print(f"[解析結果] 角色名稱: {name_part}")

            if name_part == expected_game_name:
                print("✅ 角色名稱匹配，繼續執行付款流程")
                return True
            else:
                print(f"❌ 角色名稱不符：抓取到「{name_part}」vs 預期「{expected_game_name}」")
                # 資料不符，自動關閉並退出
                context.close()
                browser.close()
                exit()
        else:
            print(f"⚠️ 抓取格式不符，無法解析：{text}")
            context.close()
            browser.close()
            exit()

    except Exception as e:
        print(f"❌ 抓取失敗：{e}")
        context.close()
        browser.close()
        exit()


def run(playwright: Playwright, uid: str, game_name: str) -> None:
    # 啟動 Chromium 瀏覽器（可見模式）
    browser = playwright.chromium.launch(headless=True)
    # 建立新的瀏覽器上下文與分頁
    context = browser.new_context()
    page = context.new_page()

    # 1. 前往充值頁面
    page.goto("https://pay.neteasegames.com/identityv/topup/")

    # 2. 點擊「Japan - 日本語」切換語言
    page.wait_for_selector("text=Japan - 日本語", timeout=10000)
    page.get_by_text("Japan - 日本語").click()

    # 3. 打開國家下拉選單並選擇「Philippines」
    page.wait_for_selector("#rc_select_1", timeout=10000)
    page.locator("#rc_select_1").click()
    page.wait_for_selector("text=Philippines", timeout=10000)
    page.get_by_text("Philippines").click()

    # 4. 切回「中文（繁體）」
    page.wait_for_selector("text=中文（繁體）", timeout=10000)
    page.get_by_text("中文（繁體）").click()

    # 5. 點擊「角色ID登入」
    page.wait_for_selector("text=角色ID登入", timeout=10000)
    page.get_by_text("角色ID登入").click()

    # 6. 打開伺服器下拉，選擇「Asia」
    page.wait_for_selector("#rc_select_0", timeout=10000)
    page.locator("#rc_select_0").click()
    page.wait_for_selector("text=Asia", timeout=10000)
    page.get_by_text("Asia").click()

    # 7. 填入遊戲 ID
    textbox = page.get_by_role("textbox", name="請輸入遊戲ID")
    textbox.wait_for(state="visible", timeout=10000)
    textbox.click()
    textbox.fill(uid)

    # 8. 勾選同意隱私政策和用戶協議
    checkbox = page.get_by_role(
        "checkbox",
        name="我已閱讀並同意《隱私政策》 和 《用戶協議》。"
    )
    checkbox.wait_for(state="attached", timeout=10000)
    checkbox.check()

    # 9. 點擊「登 入」按鈕提交
    button = page.get_by_role("button", name="登 入")
    button.wait_for(state="visible", timeout=10000)
    button.click()

    # 10. 檢查畫面上的遊戲資訊是否正確
    check_game_info(page, game_name, context, browser)

    # 11. 點擊 NetEase Credit 圖示，等待新分頁彈出
    credit_icon = page.get_by_role("img", name="NetEase Credit")
    credit_icon.wait_for(state="visible", timeout=10000)
    with page.expect_popup() as page1_info:
        credit_icon.click()
    page1 = page1_info.value

    # 12. 在新分頁填入帳號與密碼
    account_input = page1.locator("input[name=\"account\"]")
    account_input.wait_for(state="visible", timeout=100000)
    account_input.click()
    account_input.fill(topup_account)

    password_input = page1.locator("input[name=\"hash_password\"]")
    password_input.wait_for(state="visible", timeout=10000)
    password_input.click()
    password_input.fill(topup_password)

    # 13. 點擊「登入」按鈕
    login_btn = page1.locator("div").filter(has_text=re.compile(r"^登入$")).nth(2)
    login_btn.wait_for(state="attached", timeout=10000)
    login_btn.click()

    # 14. 等待 NetEase Credit 分頁自動關閉
    page1.wait_for_event("close")

    # 15. 回到主頁，選擇金額（這裡點擊顯示「499.」的第二個選項）
    amount_btn = page.get_by_text("499.").nth(1)
    amount_btn.wait_for(state="attached", timeout=10000)
    amount_btn.click()

    # 16. 勾選 NetEase Pay 付款方式
    pay_checkbox = page.get_by_role("checkbox", name="NetEase Pay")
    pay_checkbox.wait_for(state="attached", timeout=10000)
    pay_checkbox.check()

    # 17. 點擊「儲 值」按鈕發起支付
    topup_btn = page.get_by_role("button", name="儲 值")
    topup_btn.wait_for(state="visible", timeout=10000)
    topup_btn.click()

    # 18. 驗證 OTP 碼長度是否為 6 碼
    if len(topup_otp_code) != 6:
        raise ValueError("驗證碼長度不正確，請確認 .env 設定")

    # 19a. 等待第一個 OTP input 出現 (也就是 DOM 裡有任何一個 maxlength=1 的 text input)
    page.wait_for_selector("input[type='text'][maxlength='1']", timeout=20000)

    # 19b. 拿到所有 maxlength=1 的 input（應該就是 6 個 OTP 欄位）
    otp_fields = page.locator("input[type='text'][maxlength='1']")
    count = otp_fields.count()
    if count < 6:
        raise ValueError(f"OTP 欄位數量不足 (找到 {count} 個，但需要 6 個)")

    # 19c. 逐一滾動並填入
    for i, digit in enumerate(topup_otp_code):
        field = otp_fields.nth(i)
        # 確保欄位已經 attach 到 DOM
        field.wait_for(state="attached", timeout=5000)
        # 把它滾進可見範圍（避免在畫面外點不到）
        field.scroll_into_view_if_needed()
        # 填入單一數字
        field.fill(digit)
    # --- OTP 欄位填寫段落 end ---


    # 20. 點擊「確 定」完成 OTP 驗證
    confirm_btn = page.get_by_role("button", name="確 定")
    confirm_btn.wait_for(state="visible", timeout=10000)
    confirm_btn.click()

    # 21. 點擊「查看訂單」確認訂單狀態
    view_order_btn = page.get_by_role("button", name="查看訂單")
    view_order_btn.wait_for(state="visible", timeout=10000)
    view_order_btn.click()

    # 22. 定位「支付成功」訊息框，並截圖
    pattern = re.compile(
        rf"支付成功.*角色：{re.escape(game_name)} \({re.escape(uid)}\).*伺服器：Asia"
    )
    success_box = page.locator("div").filter(has_text=pattern).nth(2)
    success_box.wait_for(state="visible", timeout=10000)
    take_screenshot(game_name, uid, element=success_box)

    # 23. 最後再點一次「確 定」關閉成功提示
    final_confirm = page.get_by_role("button", name="確 定")
    final_confirm.wait_for(state="visible", timeout=10000)
    final_confirm.click()


    # ---------------------
    context.close()
    browser.close()

def validate_screenshots(expected_count, game_name, uid):
    """驗證截圖數量是否與預期相符。"""
    # 直接指向為本次執行建立的子資料夾
    run_specific_folder = os.path.join("screenshots", f"{game_name}_{uid}")
    actual_count = 0

    try:
        # 檢查子資料夾是否存在
        if os.path.isdir(run_specific_folder):
            # 計算子資料夾中所有 .png 檔案的數量
            all_files_in_subdir = os.listdir(run_specific_folder)
            run_screenshots = [f for f in all_files_in_subdir if f.endswith(".png")]
            actual_count = len(run_screenshots)

        print(f"\n--- 驗證報告 ---")
        print(f"預期執行次數：{expected_count}")
        print(f"實際成功截圖數量：{actual_count}")

        if actual_count == expected_count:
            print("✅ 驗證成功：截圖數量與執行次數相符。")
        else:
            print(f"❌ 驗證失敗：數量不符！可能有 {expected_count - actual_count} 次執行失敗或未成功截圖。")
            print("請檢查 logs 或 screenshots 資料夾。")

    except Exception as e:
        print(f"\n--- 驗證報告 ---")
        print(f"❌ 驗證時發生未知錯誤：{e}")

def check_balance(playwright: Playwright, num_runs: int, uid: str, game_name: str) -> bool:
    """
    在執行主要任務前，先檢查帳號餘額是否足夠。

    Returns:
        bool: 如果餘額充足則返回 True，否則返回 False。
    """
    print("--- 正在進行事前餘額檢查 ---")
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # --- 登入流程 (與 run 函式完全對齊，包含所有等待) ---
        page.goto("https://pay.neteasegames.com/identityv/topup/")

        page.wait_for_selector("text=Japan - 日本語", timeout=10000)
        page.get_by_text("Japan - 日本語").click()

        page.wait_for_selector("#rc_select_1", timeout=10000)
        page.locator("#rc_select_1").click()
        page.wait_for_selector("text=Philippines", timeout=10000)
        page.get_by_text("Philippines").click()

        page.wait_for_selector("text=中文（繁體）", timeout=10000)
        page.get_by_text("中文（繁體）").click()

        page.wait_for_selector("text=角色ID登入", timeout=10000)
        page.get_by_text("角色ID登入").click()

        page.wait_for_selector("#rc_select_0", timeout=10000)
        page.locator("#rc_select_0").click()
        page.wait_for_selector("text=Asia", timeout=10000)
        page.get_by_text("Asia").click()

        textbox = page.get_by_role("textbox", name="請輸入遊戲ID")
        textbox.wait_for(state="visible", timeout=10000)
        textbox.fill(uid)

        checkbox = page.get_by_role(
            "checkbox",
            name="我已閱讀並同意《隱私政策》 和 《用戶協議》。"
        )
        checkbox.wait_for(state="attached", timeout=10000)
        checkbox.check()

        button = page.get_by_role("button", name="登 入")
        button.wait_for(state="visible", timeout=10000)
        button.click()

        credit_icon = page.get_by_role("img", name="NetEase Credit")
        credit_icon.wait_for(state="visible", timeout=10000)
        with page.expect_popup() as page1_info:
            credit_icon.click()
        page1 = page1_info.value

        account_input = page1.locator("input[name=\"account\"]")
        account_input.wait_for(state="visible", timeout=100000)
        account_input.fill(topup_account)

        password_input = page1.locator("input[name=\"hash_password\"]")
        password_input.wait_for(state="visible", timeout=10000)
        password_input.fill(topup_password)

        login_btn = page1.locator("div").filter(has_text=re.compile(r"^登入$")).nth(2)
        login_btn.wait_for(state="attached", timeout=10000)
        login_btn.click()

        page1.wait_for_event("close")

        # --- 抓取餘額 ---
        print("✅ 登入成功，正在抓取餘額...")
        balance_element = page.locator("em.cards-balance-total")
        balance_element.wait_for(state="visible", timeout=10000)

        balance_text = balance_element.inner_text() # e.g., "PHP 1,309.00"

        # 解析金額
        balance_value_str = re.search(r'[\d,.]+', balance_text).group().replace(',', '')
        current_balance = float(balance_value_str)

        # --- 計算並比較 ---
        cost_per_run = 499
        required_amount = num_runs * cost_per_run

        print(f"目前帳戶餘額：PHP {current_balance:.2f}")
        print(f"本次 {num_runs} 次任務所需總金額：PHP {required_amount:.2f}")

        if current_balance >= required_amount:
            print("✅ 餘額充足，準備開始執行任務。")
            return True
        else:
            shortfall = required_amount - current_balance
            print(f"❌ 餘額不足！尚缺 PHP {shortfall:.2f}，請儲值後再執行。")
            print("程式將自動終止。")
            return False

    except Exception as e:
        print(f"❌ 餘額檢查過程中發生錯誤：{e}")
        print("請檢查您的帳號密碼或網路連線。程式將自動終止。")
        return False
    finally:
        print("--- 餘額檢查完畢 ---")
        context.close()
        browser.close()


def main_logic():
    """主邏輯，包含使用者輸入、啟動線程與最終驗證。"""
    # 簡易 CLI 輸入
    num_runs = int(input("請輸入要執行的總次數："))
    max_concurrent_runs = int(input("請輸入要同時執行的最大數量 (建議 3-5)："))
    uid = input("請輸入 UID：")
    game_name = input("請輸入遊戲角色名稱：")

    # 在所有任務開始前，先用 Playwright 檢查餘額
    with sync_playwright() as playwright:
        if not check_balance(playwright, num_runs, uid, game_name):
            return  # 如果餘額不足，直接結束 main_logic

    # 建立信號量，限制同時運行的線程數量
    semaphore = threading.Semaphore(max_concurrent_runs)

    def thread_run(uid_str, game_name_str):
        """每個線程要執行的目標函式"""
        # 在執行前，先取得一個信號量 (如果計數為 0 則會在此等待)
        semaphore.acquire()
        try:
            # 每個執行緒都建立自己獨立的 Playwright 實例
            # 確保執行緒之間互不干擾
            with sync_playwright() as p:
                run(p, uid_str, game_name_str)
        finally:
            # 確保無論成功或失敗，都會釋放信號量，讓下一個線程可以執行
            semaphore.release()

    threads = []
    print(f"🚀 即將啟動 {num_runs} 個任務，每次最多並行 {max_concurrent_runs} 個...")

    # 建立並啟動所有線程
    for _ in range(num_runs):
        # 不再需要傳遞 playwright 實例給執行緒
        thread = threading.Thread(target=thread_run, args=(uid, game_name))
        threads.append(thread)
        thread.start()

    # 等待所有線程執行完畢
    for thread in threads:
        thread.join()

    print("✅ 所有任務執行完畢！")

    # --- 驗證截圖數量 ---
    validate_screenshots(num_runs, game_name, uid)


if __name__ == "__main__":
    main_logic()
    input("\n任務已結束，請按 Enter 鍵關閉視窗...")




